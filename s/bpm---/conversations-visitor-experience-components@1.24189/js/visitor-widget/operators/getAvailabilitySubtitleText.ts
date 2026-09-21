export const getAvailabilitySubtitleText = (showAvailabilityMessage, typicalResponseTimeMessage, officeHoursMessage, preview, previewResponseTimeText) => {
  if (preview && previewResponseTimeText) return previewResponseTimeText;
  if (showAvailabilityMessage && (typicalResponseTimeMessage || officeHoursMessage)) {
    return typicalResponseTimeMessage || officeHoursMessage;
  }
  return undefined;
};