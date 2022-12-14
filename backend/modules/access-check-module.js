function UserHasAccessTo(requestedData, requestUserId) {
  if (typeof requestedData === "object") {
    const userId = requestedData.user._id.toString();
    return userId === requestUserId;
  } else {
    return requestedData === requestUserId;
  }
}

module.exports = UserHasAccessTo;
