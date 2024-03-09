export const AdminCheckResult = async (req, res) => {
    try {
        res.status(201).json({"Success": "Yes",})

    } catch (error) {
        console.log("Error in AdminCheck controller: ", err.message)
        res.status(500).json({error: "Internal server error"})
    }
}