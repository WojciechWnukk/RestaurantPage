const router = require("express").Router()
const { Table, validate } = require("../models/table")

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error)
            return res.status(400).send({ message: "Bad request" })
        const table = await Table.findOne({ tableNumber: req.body.tableNumber })
        if (table)
            return res
                .status(409).send({ message: "already Exist" })
        await new Table({ ...req.body }).save()
        res.status(201).send({ message: "created successfully" })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}

)

router.get("/", async (req, res) => {
    Table.find().exec()
        .then(async () => {
            const tables = await Table.find()
            res.status(200).send({ data: tables, message: "Lista stolików" })
        })
        .catch(error => {
            res.status(500).send({ message: error.message })
        })
})

router.get("/:tableId", async (req, res) => {
    Table.findById(req.params.tableId)
        .then(table => {
            if (!table) {
                return res.status(404).json({ message: "Table not found" });
            }
            res.status(200).json({ data: table, message: "Table found" });
        })
        .catch(error => {
            res.status(500).json({ message: "Internal Server Error" });
        })
})

router.put("/:tableId", async (req, res) => {
    try {
        const { tableId } = req.params
        const { x, y, tableStatus } = req.body

        if (tableId && tableStatus) {
            const table = await Table.findByIdAndUpdate(tableId, { tableStatus }, { new: tableStatus })
            res.status(200).json({ data: table, message: "Table status updated successfully" });
        }
        if (tableId && x && y) {
            const table = await Table.findByIdAndUpdate(tableId, { x, y }, { new: x, new: y })

            if (!table) {
                return res.status(404).json({ message: "Table not found" });
            }
            res.status(200).json({ data: table, message: "Table position updated successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.delete("/:tableId", async (req, res) => {
    try {
        const { tableId } = req.params
        const table = await Table.findByIdAndDelete(tableId)

        if (!table) {
            return res.status(404).json({ message: "Table not found" });
        }
        res.status(200).json({ data: table, message: "Table deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = router