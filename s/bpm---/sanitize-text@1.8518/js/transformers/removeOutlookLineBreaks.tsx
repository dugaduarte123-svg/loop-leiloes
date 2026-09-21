import { secureDocument } from '../sanitizers/SanitizeConfiguration';
const isOutlookEmailWithChildren = (node, nodeName) => nodeName === 'p' && node && node.classList && node.classList.contains('MsoNormal') && node.children && node.children.length;
const removeNbsp = node => {
  const op = secureDocument.createElement('o:p');
  if (node.innerHTML.includes('&nbsp;')) {
    op.innerHTML = node.innerHTML.replace(/&nbsp;/g, '').trim();
    return op;
  }
  return node;
};
const isEmptyBrokenParagraph = node => {
  if (!node || node.tagName.toLowerCase() !== 'o:p') {
    return false;
  }

  // https://issues.hubspotcentral.com/browse/CRMMAIL-6523
  // "<o:p> &nbsp;SampleText&nbsp; </o:p>" was being detected as an empty broken
  // paragraph and "SampleText" would not render. We have to recreate the
  // "<o:p> SampleText </o:p>" without &nbsp; to check for any other existing text
  const nodeWithoutNbsp = removeNbsp(node);
  return !nodeWithoutNbsp.children.length && nodeWithoutNbsp.innerHTML === '';
};
const isSpanWithBrokenParagraph = child => child && child.tagName.toLowerCase() === 'span' && isEmptyBrokenParagraph(child.firstElementChild);

// Walks parents (IE11-safe, no Element.closest) up to the sanitize body root.
const hasParagraphAncestor = node => {
  let parent = node.parentElement;
  while (parent && parent.nodeName && parent.nodeName.toLowerCase() !== 'body') {
    if (parent.nodeName.toLowerCase() === 'p') {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
};

// Tags valid inside a <p>. Allowlisted (not denylisted) so anything unknown
// safely degrades to the <div> fallback rather than producing invalid HTML.
const PHRASING_CONTENT = new Set(['a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'picture', 'progress', 'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var', 'video', 'wbr',
// Legacy inline elements Word/Outlook HTML relies on (especially <font>).
'font', 'big', 'strike', 'tt', 'nobr', 'acronym',
// Outlook's own inline <o:p> markers, stripped later.
'o:p']);
const isPhrasingContentOnly = node => Array.from(node.querySelectorAll('*')).every(el => PHRASING_CONTENT.has(el.tagName.toLowerCase()));
export const removeOutlookLineBreaks = ({
  node,
  node_name
}) => {
  // Help Desk strips the <p> wrappers, so paragraphs arrive as bare spans split
  // by empty <o:p>; restore the break when there's no <p> ancestor. PS #157414.
  if (node_name === 'o:p' && isEmptyBrokenParagraph(node) && !hasParagraphAncestor(node)) {
    return {
      node: secureDocument.createElement('br')
    };
  }
  if (!isOutlookEmailWithChildren(node, node_name)) {
    return null;
  }
  const child = node.firstElementChild;
  if (child && isSpanWithBrokenParagraph(child) && child.childNodes.length > 1) {
    // https://issues.hubspotcentral.com/browse/CRMMAIL-5459
    // the <span> has child content other than the empty, broken paragraph
    // so we need to remove only the empty, broken paragraph "<o:p> &nbsp; </o:p>"
    // Don't use ChildNode.remove() for IE11 support
    const grandChild = child.firstElementChild;
    if (grandChild) {
      child.removeChild(grandChild);
      return removeOutlookLineBreaks({
        node,
        node_name: 'p'
      });
    }
  }
  if (child && (isEmptyBrokenParagraph(child) || isSpanWithBrokenParagraph(child))) {
    // https://issues.hubspotcentral.com/browse/CRMMAIL-3503
    // https://issues.hubspotcentral.com/browse/CRMMAIL-5147
    if (node.childNodes.length > 1) {
      // remove the empty, broken paragraph "<o:p> &nbsp; </o:p>"
      node.removeChild(child);

      // process the rest of the node in case there are other broken paragraphs to remove
      return removeOutlookLineBreaks({
        node,
        node_name: 'p'
      });
    }
    return {
      node: secureDocument.createElement('br')
    };
  }

  // Keep <p> for phrasing-only paragraphs (preserves the margin); fall back to
  // <div> for anything else. PS #157414.
  const wrapper = isPhrasingContentOnly(node) ? secureDocument.createElement('p') : secureDocument.createElement('div');
  Object.values(node.attributes).forEach(attribute => {
    try {
      if (attribute.nodeValue) {
        wrapper.setAttribute(attribute.nodeName, attribute.nodeValue);
      }
    } catch (err) {
      // Customer has malformed HTML, this allows us to catch the error and proceed with parsing
      // https://issues.hubspotcentral.com/browse/CRMMAIL-7984
    }
  });
  // https://issues.hubspotcentral.com/browse/CRMMAIL-4310
  wrapper.innerHTML = node.innerHTML.replace(/&nbsp;/g, ' ').trim();
  return {
    node: wrapper
  };
};