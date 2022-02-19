const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the name"],
        maxlength: 50,
        minlength: 5,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: validator.isEmail,
            message: "Please enter your email",
        },
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    activationCode: {
        type: String,
        required: [true, "Please attach confirmation code"],
    },
    isActive: {
        type: Boolean,
        enum: [true, false],
        default: false,
    },
}, { timestamps: true });

UserSchema.pre("save", async function() {
    // TO check which object modified
    //  console.log(this.modifiedPaths())
    //  console.log(this.isModified('name')); -- Return true if name is modified

    if (!this.isModified("password")) return; // If password is not modified just return else update password hash
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("User", UserSchema);