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
      c.name AS category_name
    FROM products p
    LEFT JOIN product_category c ON p.category_id = c.id
    WHERE 1=1
  `;

  const params = [];

  // Filter berdasarkan nama produk (LIKE)
  if (search) {
    sql += ` AND p.product_name LIKE ?`;
    params.push(`%${search}%`);
  }

  // Filter berdasarkan kategori
  if (category) {
    sql += ` AND c.name = ?`;
    params.push(category);
  }

  // Tambahkan pagination
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
    const { product_name, description, price, category_id } = req.body;

    
    if (!product_name || !price) {
        return response(400, {}, "Semua field harus diisi", res);
    }

    const sql = `INSERT INTO products (product_name, description, price, category_id) VALUES (?, ?, ?, ?)`;

    db.query(sql, [product_name, description, price, category_id], (err, result) => {
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
  const { product_name, description, price } = req.body;

  if (!product_name || !description || !price) {
    return response(400, {}, "Semua field wajib diisi", res);
  }

  const sql = `UPDATE products SET product_name = ?, description = ?, price = ?, category_id = ? WHERE id = ?`;

  db.query(sql, [product_name, description, price, id], (err, result) => {
    if (err) {
      console.error(err);
      return response(500, {}, "Gagal mengupdate data", res);
    }

    if (result.affectedRows === 0) {
      return response(404, {}, "Data tidak ditemukan", res);
    }

    return response(
      200,
      { id, product_name, description, price },
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

// //FILTER PRODUK
// function filterproduct(req, res) {
//   const search = req.query.search; 
//   const sql = `SELECT * FROM products WHERE product_name LIKE ?`; 
//   const searchParam = `%${search}%`; 

//   db.query(sql, [searchParam], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "Terjadi kesalahan", error: err });
//     }
//     res.status(200).json({ message: "Hasil pencarian produk", data: result });
//   });
// }

// //PAGINATION
// const getPaginatedProducts = (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 2;
//   const offset = (page - 1) * limit;

//   const sql = `SELECT * FROM products LIMIT ${limit} OFFSET ${offset}`;
//   db.query(sql, (err, result) => {
//     if (err) return response(500, [], "Gagal mengambil data", res);

//     response(200, result, "data page", res);
//   });
// };

// //FILTER BY CATEGORY
// function filterByCategory(req, res) {
//   const category = req.query.category;

//   const sql = `
//     SELECT p.id, p.product_name, p.description, p.price, c.name
//     FROM products p 
//     JOIN product_category c ON p.category_id = c.id
//     WHERE c.name = ?`;

//   db.query(sql, [category], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     if (result.length === 0) {
//       return res.status(404).json({ message: "Produk dengan kategori tersebut tidak ditemukan" });
//     }

//     res.status(200).json(result);
//   });
// }

module.exports = {
  getProduct,
  post,
  put,
  deletePro
};
