const db = require("../config/db");
const response = require("../response");

//GET PRODUK
function getProduct(req, res) {
  const { search, category, page = 1, limit = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let sql = `
    SELECT 
      p.id,
      p.product_name,
      p.description,
      p.price,
      p.image,
      c.name AS category_name
    FROM products p
    LEFT JOIN product_category c ON p.category_id = c.id
    WHERE 1=1
  `;

  const params = [];

  if (search) {
    sql += ` AND p.product_name LIKE ?`;
    params.push(`%${search}%`);
  }

  if (category) {
    sql += ` AND c.name = ?`;
    params.push(category);
  }

  sql += ` LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Tidak ada produk ditemukan" });
    }

    res.status(200).json({
      message: "Berhasil mengambil produk",
      data: result,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  });
}


//POST PRODUK
function post(req, res) {
  const { product_name, description, price, category_id, image } = req.body;

  if (!product_name || !price) {
    return response(400, {}, "Semua field harus diisi", res);
  }

  const sql = `INSERT INTO products (product_name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [product_name, description, price, category_id, image], (err, result) => {
    if (err) {
      console.error("Query Error: ", err);
      return response(500, {}, "Gagal menyimpan data", res);
    }

    return response(201, { id: result.insertId, ...req.body }, "Produk berhasil ditambahkan", res);
  });
}

//PUT PRODUK
function put(req, res) {
  const id = req.params.id;
  const { product_name, description, price, category_id, image } = req.body;

  if (!product_name || !description || !price || !category_id || !image) {
    return response(400, {}, "Semua field wajib diisi", res);
  }

  const sql = `UPDATE products SET product_name = ?, description = ?, price = ?, category_id = ?, image = ? WHERE id = ?`;

  db.query(sql, [product_name, description, price, category_id, image, id], (err, result) => {
    if (err) {
      console.error(err);
      return response(500, {}, "Gagal mengupdate data", res);
    }

    if (result.affectedRows === 0) {
      return response(404, {}, "Data tidak ditemukan", res);
    }

    return response(
      200,
      { id, product_name, description, price, category_id, image },
      "Data berhasil diupdate",
      res
    );
  });
}

//DELETE PRODUK
function deletePro(req, res) {
  const id = req.params.id;
  const sql = `DELETE FROM products WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send("Gagal menghapus produk");
    response(200, result, "data berhasil dihapus", res);
  });
}

module.exports = {
  getProduct,
  post,
  deletePro, put
};
