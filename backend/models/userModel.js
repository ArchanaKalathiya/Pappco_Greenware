const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please write your name"],
    },
    email: {
        type: String,
        required: [true, "Please add your email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Create a password"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    contact: {
        type: String,
        default: "+91"
    },
    address: {
        type: String,
        required: [true, "Enter your address"]
    },
    postcode: {
        type: String,
        required: [true, "Enter your postcode"]
    },
    userid: {
        type: String,
        unique: true,
        default: function() {
            return `user_${new mongoose.Types.ObjectId()}`;
        }
    },
    description: {
        type: String,
        default: "Remember to keep your user ID safe"
    },
    bio: {
        type: String,
        maxLength: [250, "Bio must not be more than 250 characters"],
        default: "bio",
    }
}, {
    timestamps: true,
});

    // Encrypt password before saving to DB
    userSchema.pre("save", async function(next) {

        if(!this.isModified("password")){
            return next();
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password,salt);
        this.password = hashedPassword
        next()
    });

const User = mongoose.model("User", userSchema);

module.exports = User;
