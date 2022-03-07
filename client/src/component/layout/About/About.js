import React from "react";
import "./aboutSection.css";
import { Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";

const About = () => {
    return (
        <div className="aboutSection">
        <div></div>
        <div className="aboutSectionGradient"></div>
        <div className="aboutSectionContainer">
            <Typography component="h1">About Us</Typography>

            <div>
            <div>
                <Avatar
                style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
                src="https://res.cloudinary.com/ecommercewebsite/image/upload/v1644266915/avtares/admin_ktxhdt.jpg"
                alt="Founder"
                />
                <Typography>Sohail Saddique</Typography>
                \
                <span>
                This is a sample wesbite made by @SohailSaddique. Only with the
                purpose to show I am full stack developer of MERN stack (helps you to hire me)
                </span>
            </div>
            <div className="aboutSectionContainer2">
                <Typography component="h2">Our Brands</Typography>
                <a
                href="https://www.youtube.com"
                target="blank"
                >
                <YouTubeIcon className="youtubeSvgIcon" />
                </a>
            </div>
            </div>
        </div>
        </div>
    );
};

export default About;