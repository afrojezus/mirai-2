/**
 * Notifyier module
 */

const message = message => {
  if (message) {
    return message;
  } else {
    return false;
  }
};

const close = () => message();

export default {
  message,
  close
};
