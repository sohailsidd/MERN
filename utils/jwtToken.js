function jwtToken (user, statesCode, res) 
{
    const token = user.getToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.status(statesCode).cookie("token", token, options).json({
        success: true,
        user: user,
        token: token
    });
}

module.exports = jwtToken;