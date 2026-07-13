const express = require("express");
const router = express.Router();
const cloudant = require("../cloudant");

const DB = process.env.DB_NAME;

// GET all tasks
router.get("/", async (req, res) => {
    try {
        const result = await cloudant.postAllDocs({
            db: DB,
            includeDocs: true,
        });

        const tasks = result.result.rows.map(row => row.doc);

        res.json(tasks);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// ADD task
router.post("/", async (req, res) => {

    try {

        const { title } = req.body;

        const result = await cloudant.postDocument({
            db: DB,
            document: {
                title,
                completed: false
            }
        });

        res.json({
            message: "Task Added Successfully",
            result: result.result
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});
// UPDATE Task
router.put("/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const { title, completed } = req.body;

        // Get old document
        const oldDoc = await cloudant.getDocument({
            db: DB,
            docId: id
        });

        const result = await cloudant.postDocument({
            db: DB,
            document: {
                _id: id,
                _rev: oldDoc.result._rev,
                title: title !== undefined ? title : oldDoc.result.title,
                completed: completed !== undefined ? completed : oldDoc.result.completed
            }
        });

        res.json({
            message: "Task Updated Successfully",
            result: result.result
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }

});
// DELETE all tasks
router.delete("/all", async (req, res) => {
    try {
        const result = await cloudant.postAllDocs({
            db: DB,
            includeDocs: true,
        });

        const docs = result.result.rows
            .map(row => row.doc)
            .map(doc => ({ _id: doc._id, _rev: doc._rev, _deleted: true }));

        if (docs.length > 0) {
            await cloudant.postBulkDocs({
                db: DB,
                bulkDocs: { docs }
            });
        }

        res.json({ message: "All tasks deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Task
router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const doc = await cloudant.getDocument({
            db: DB,
            docId: id
        });

        await cloudant.deleteDocument({
            db: DB,
            docId: id,
            rev: doc.result._rev
        });

        res.json({
            message: "Task Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});
module.exports = router;