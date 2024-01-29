import { Request, Response, NextFunction } from "express";
import User from "../../models/user";

interface Body {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    dob: Date;
    password: string;
    countryCode: string;
    gender: string;
}

type Errors = {
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    password: string,
    dob: string,
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as Body;
    body.username = body.username.toLowerCase();
    body.email = body.email.toLowerCase();
    body.gender = body.gender.toLocaleLowerCase();

    const {
        username,
        firstname,
        lastname,
        email,
        phone,
        password,
        countryCode,
        gender,
    } = body;

    const dob = new Date(body.dob);

    const errors = <Errors>{};

    const usernameRegex = /^[a-z0-9_.]{3,}$/;
    const nameRegex = /^\p{L}{3,}$/u;
    const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^.{8,}$/;
    const countryCodeRegex = /^\d{1,4}$/;

    if (!countryCodeRegex.test(countryCode) || (gender !=='male' && gender !== 'female')) {
        return res.status(500).json({message: "Internal server error"});
    }

    if (await User.findOne({username})) {
        errors.username = "Username taken";
    } else if (!usernameRegex.test(username)) {
        errors.username = "Username only accepts number, undercore, dot and english alphabets"
    }

    if (!nameRegex.test(firstname)) {
        errors.firstname = "Name should not contain special characters or white spaces";
    }

    if (!nameRegex.test(lastname)) {
        errors.lastname = "Name should not contain special characters or white spaces";
    }

    if (await User.findOne({"email.email": email})) {
        errors.email = "Email already exists";
    } else if (!emailRegex.test(email)) {
        errors.email = "Please provide a valid email";
    }

    if (await User.findOne({"phone.phone": phone})) {
        errors.phone = "Phone number already exists";
    } else if (!phoneRegex.test(phone)) {
        errors.phone = "Please provide a valid phone number";
    }

    if (!passwordRegex.test(password)) {
        errors.password = "Password must atleast have 8 characters";
    }

    if (isNaN(dob.getTime())) {
        errors.dob = "Please enter your date of birth";
    } else {
        const dateOfBirth: Date = new Date(dob);
        const dateNow: Date = new Date();
        const age = (dateNow.getFullYear() - dateOfBirth.getFullYear());
        if (age < 18) {
            errors.dob = "Must be eighteen years old";
        }
    }

    if (Object.keys(errors).length === 0) {
        next();
    } else {
        return res.status(400).json({message: "Validation failed", errors});
    }
};