import { Schema, model } from "mongoose";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import slugify from "slugify";

const UserSchema = new Schema(
  {
    avatar: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, default: "" },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, required: false },
    admin: { type: Boolean, default: false },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
        slug: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const nameSlugs = this.name.split(" ").map((name) =>
      slugify(name, { lower: true })
    );
    this.slugs = nameSlugs;
  }

  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  return next();
});

UserSchema.methods.generateJWT = async function () {
  return await sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

const User = model("User", UserSchema);
export default User;
