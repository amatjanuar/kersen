const db = require("../config/db");
// const response = require("../response");

function getCategories(req, res) {
  db.query("SELECT * FROM product_category", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(result);
  });
}

//post category
function postCategory(req, res) {
  const { name } = req.body;
  const sql = "INSERT INTO product_category (name) VALUES (?)";
  db.query(sql, [name], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Insert error", error: err });
    res.status(201).json({ message: "Category added", id: result.insertId });
  });
}

//put category
function updateCategory(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ message: "Nama kategori tidak boleh kosong" });
  }

  const sql = "UPDATE product_category SET name = ? WHERE id = ?";
  db.query(sql, [name, id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal mengupdate kategori", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.status(200).json({ message: "Kategori berhasil diupdate" });
  });
}

//delete category
function deleteCategory(req, res) {
  const { id } = req.params;

  const sql = "DELETE FROM product_category WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal menghapus kategori", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.status(200).json({ message: "Kategori berhasil dihapus" });
  });
}

module.exports = {
  getCategories,
  postCategory,
  updateCategory,
  deleteCategory
};
