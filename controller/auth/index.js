module.exports = {
  signup: require("./signup"),
  signin: require("./signin"),
  getLoggedInUser: require("./getLoggedInUser"),
  refresh_token: require("./refresh_token"),
  logout: require("./logout"),
  users: require("./users"),
  authors: require("./authors"),
  reset_password: require("./reset_password"),
  set_reset_password: require("./set_reset_password"),
  delete_user: require("./delete_user"),

  // admin can manage
  update_user: require("./update_user"),
  update_admin_user: require("./update_admin_user"),
  add_new_user: require("./add_new_user"),
  delete_multiple_users: require("./delete_multiple_users"),
  change_password: require("./change_password"),
  create_password: require("./create_password"),
  send_message: require("./send_message"),
  update_client_client: require("./update_with_client"),
};
