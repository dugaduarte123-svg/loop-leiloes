/**
 * The JavaScript representation of a server sent event.
 *
 * @link https://html.spec.whatwg.org/multipage/server-sent-events.html
 *
 * Server sent events are delimited by a double newline, so the following would look like this:
 * [{id: '123', event: 'foo', data: '{"foo": \n"bar"}'}, {data: '"foo"'}]
 *
 * id: 123
 * event: foo
 * data: {"foo":
 * data: "bar"}
 *
 * data: "foo"
 *
 */

/**
 * Parses a server sent event and returns the parsed data.
 * @param eventStr The chunk of data to parse.
 */
function parseServerSentEvent(eventStr) {
  const lines = eventStr.split('\n');
  const event = {};
  const dataLines = [];
  for (const line of lines) {
    // Handle comments (lines starting with ':')
    if (line.startsWith(':')) continue;

    // Find the first colon
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.substring(0, colonIndex);
    // Handle both 'field: value' and 'field:value' formats
    // If there's a space after colon, skip it
    const valueStart = line[colonIndex + 1] === ' ' ? colonIndex + 2 : colonIndex + 1;
    const value = line.substring(valueStart);
    if (key === 'data') {
      dataLines.push(value);
    } else if (key === 'event') {
      event.event = value;
    } else if (key === 'id') {
      event.id = value;
    }
  }

  // Join data lines with newlines, but don't add a trailing newline
  if (dataLines.length > 0) {
    event.data = dataLines.join('\n');
  }
  return event;
}
export function parseServerSentEvents(stream, consumed = 0) {
  const events = [];
  let sseBoundary = stream.indexOf('\n\n', consumed);
  while (sseBoundary !== -1) {
    const eventText = stream.slice(consumed, sseBoundary);
    events.push(parseServerSentEvent(eventText));
    consumed = sseBoundary + 2;
    sseBoundary = stream.indexOf('\n\n', consumed);
  }
  return {
    events,
    consumed
  };
}