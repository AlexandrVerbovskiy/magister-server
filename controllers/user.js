const STATIC = require("../static");
const { generateAccessToken } = require("../utils");
const Controller = require("./controller");

class User extends Controller {
  filterUserFields = (user) => {
    delete user["password"];
  };

  noUserByEmailCheck = async (email) => {
    const getByEmail = await this.userModel.getByEmail(email);

    if (getByEmail)
      this.sendErrorResponse(
        res,
        STATIC.ERRORS.DATA_CONFLICT,
        {},
        "Email was registered earlier"
      );

    return getByEmail;
  };

  register = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { name, email } = req.body;

      const resCheck = await this.noUserByEmailCheck(email);
      if (resCheck) return;

      const id = await this.userModel.create(req.body);
      const token = await this.userModel.generateEmailVerifyToken(id);

      this.sendEmailVerificationMail(email, name, token);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.CREATED,
        {},
        "Account created successfully. An account confirmation letter has been sent to the email"
      );
    });

  registerAdmin = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const userToSave = {
        ...req.body,
        role: STATIC.ROLES.ADMIN,
        active: true,
      };

      const resCheck = await this.noUserByEmailCheck(email);
      if (resCheck) return;

      await this.userModel.create(userToSave);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.CREATED,
        {},
        "Account created successfully. Try to login on the site"
      );
    });

  login = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { email, password } = req.body;
      const user = await this.userModel.findByEmailAndPassword(email, password);

      if (!user) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.UNAUTHORIZED,
          {},
          "Incorrect email or password"
        );
      }

      this.filterUserFields(user);
      const accessToken = generateAccessToken(user.id);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, {
        accessToken,
        user,
      });
    });

  setRole = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id, role } = req.body;

      await this.userModel.setRole(id, role);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        { id, role },
        "Role updated successfully"
      );
    });

  changeActive = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      const active = await this.userModel.changeActive(id);

      const message = active
        ? "User activated successfully"
        : "User deactivated successfully";

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        { id, active },
        message
      );
    });

  verifyEmail = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { token } = req.body;
      const userId = await this.userModel.getUserIdByEmailVerifiedToken(token);

      if (!userId) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          {},
          "No user found"
        );
      }

      await this.userModel.setEmailVerified(userId);
      await this.userModel.removeEmailVerifiedToken(userId);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        {},
        "Mail has been successfully verified. Try to log in"
      );
    });

  resetPassword = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { email } = req.body;
      const user = await this.userModel.getByEmail(email);

      if (!user) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          {},
          "No user found"
        );
      }

      const token = await this.userModel.generateResetPasswordToken(user.id);

      this.sendPasswordResetMail(email, user.name, token);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        {},
        '"Password reset" email sent successfully'
      );
    });

  setNewPassword = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { token, password } = req.body;
      const userId = await this.userModel.getUserIdByResetPasswordToken(token);

      if (!userId) {
        return this.sendErrorResponse(
          res,
          STATIC.ERRORS.BAD_REQUEST,
          {},
          "No user found"
        );
      }

      await this.userModel.setNewPassword(userId, password);
      await this.userModel.removeResetPasswordToken(userId);

      return this.sendSuccessResponse(
        res,
        STATIC.SUCCESS.OK,
        {},
        "Password updated successfully"
      );
    });

  updateSessionInfo = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { userId } = req.userData;
      const user = await this.userModel.getById(userId);

      if (!user) {
        return this.sendErrorResponse(res, STATIC.ERRORS.UNAUTHORIZED);
      }

      const accessToken = generateAccessToken(user.id);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, {
        accessToken,
        user,
      });
    });

  list = (req, res) =>
    this.baseWrapper(req, res, async () => {
      let page = req.body.page ?? 1;
      const filter = req.body.filter ?? "";
      const itemsPerPage = req.body.itemsPerPage ?? 20;
      const order = req.body.order ?? null;
      const orderType = req.body.orderType ?? null;

      const countItems = await this.userModel.totalCount(filter);
      const totalPages =
        countItems > 0 ? Math.ceil(countItems / itemsPerPage) : 1;

      if (page > totalPages) page = totalPages;

      const start = (page - 1) * itemsPerPage;

      const options = {
        filter,
        order,
        orderType,
        start,
        count: itemsPerPage,
        page,
        totalPages,
      };

      const users = await this.userModel.list(options);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, {
        items: users,
        options,
        countItems,
      });
    });

  delete = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.body;
      this.userModel.delete(id);
      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK);
    });

  getById = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const { id } = req.params;
      let user = {};

      if (id && /^\d+$/.test(id)) user = await this.userModel.getById(id);

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, user);
    });

  update = (req, res) =>
    this.baseWrapper(req, res, async () => {
      const id = req.body.id;
      const email = req.body.email;
      const dataToSave = req.body;

      const userByEmail = await this.userModel.getByEmail(email);

      let photo = null;

      if (req.file) {
        photo = this.moveUploadsFileToFolder(req.file, "users");
        dataToSave["photo"] = photo;
      }

      if (userByEmail && id != userByEmail.id)
        throw new Error(`User with email '${email}' already exists`);

      await this.userModel.updateById(id, req.body);

      const data = { id };

      if (photo) {
        data["photo"] = photo;
      }

      return this.sendSuccessResponse(res, STATIC.SUCCESS.OK, data);
    });
}

module.exports = new User();
