module.exports = 
{
    "debug": process.env.GUI_DEBUG && process.env.GUI_DEBUG.toLocaleLowerCase() == "true" || null,
    "apiBaseUrl": process.env.GUI_API_BASE_URL || null,
    "theme": process.env.GUI_THEME || null,
    "language": process.env.GUI_LANGUAGE || null
}