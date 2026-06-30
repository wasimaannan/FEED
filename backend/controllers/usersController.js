const { pool } = require("../config/db");

// ================= GET ALL USERS =================

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT
        UserID,
        Username,
        FullName,
        Role,
        ZoneName,
        Phone,
        IsActive,
        EnrollID
      FROM farm.Users
      ORDER BY FullName
    `);

    res.json({
      success: true,
      count: result.recordset.length,
      data: result.recordset,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================= GET USER BY ID =================

exports.getUserById = async (req, res) => {
  try {
    const result = await pool
      .request()
      .input("UserID", req.params.id)
      .query(`
        SELECT
          UserID,
          Username,
          FullName,
          Role,
          ZoneName,
          Phone,
          IsActive,
          EnrollID
        FROM farm.Users
        WHERE UserID = @UserID
      `);

    if (!result.recordset.length) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: result.recordset[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================= CREATE USER =================

exports.createUser = async (req, res) => {
  try {
    const {
      Username,
      PasswordHash,
      PasswordSalt,
      Role,
      FullName,
      ZoneName,
      Phone,
      IsActive,
      EnrollID
    } = req.body;

    await pool
      .request()
      .input("Username", Username)
      .input("PasswordHash", PasswordHash)
      .input("PasswordSalt", PasswordSalt)
      .input("Role", Role)
      .input("FullName", FullName)
      .input("ZoneName", ZoneName)
      .input("Phone", Phone)
      .input("IsActive", IsActive)
      .input("EnrollID", EnrollID)
      .query(`
        INSERT INTO farm.Users
        (
          Username,
          PasswordHash,
          PasswordSalt,
          Role,
          FullName,
          ZoneName,
          Phone,
          IsActive,
          CreatedAt,
          EnrollID
        )
        VALUES
        (
          @Username,
          @PasswordHash,
          @PasswordSalt,
          @Role,
          @FullName,
          @ZoneName,
          @Phone,
          @IsActive,
          GETDATE(),
          @EnrollID
        )
      `);

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================= UPDATE USER =================

exports.updateUser = async (req, res) => {
  try {

    const {
      Username,
      Role,
      FullName,
      ZoneName,
      Phone,
      IsActive,
      EnrollID
    } = req.body;

    await pool
      .request()
      .input("UserID", req.params.id)
      .input("Username", Username)
      .input("Role", Role)
      .input("FullName", FullName)
      .input("ZoneName", ZoneName)
      .input("Phone", Phone)
      .input("IsActive", IsActive)
      .input("EnrollID", EnrollID)
      .query(`
        UPDATE farm.Users
        SET
          Username = @Username,
          Role = @Role,
          FullName = @FullName,
          ZoneName = @ZoneName,
          Phone = @Phone,
          IsActive = @IsActive,
          EnrollID = @EnrollID
        WHERE UserID = @UserID
      `);

    res.json({
      success: true,
      message: "User updated successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================= DELETE USER =================

exports.deleteUser = async (req, res) => {
  try {

    await pool
      .request()
      .input("UserID", req.params.id)
      .query(`
        DELETE FROM farm.Users
        WHERE UserID = @UserID
      `);

    res.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};