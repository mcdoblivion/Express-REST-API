# Express-REST-API

Viết một webserver cho phép request vào và hiển thị ra 1 số file tĩnh như html hoặc text từ hệ thống.

Mô tả hệ thống:

GET http://localhost:3000/ => trả về file index.html - status code 200

POST/PUT/DELETE http://localhost:3000/ => trả về text thông báo lỗi - status code 403

Update bài tập 5:

http://localhost:3000/products hỗ trợ GET/POST/DELETE tương ứng với các thao tác: Lấy toàn bộ thông tin sản phẩm / Thêm 1 sản phẩm / Xoá tất cả sản phẩm

http://localhost:3000/products/:productId hỗ trợ GET/PUT/DELETE tương ứng với các thao tác: Lấy thông tin sản phẩm / Sửa thông tin sản phẩm / Xoá 1 sản phẩm có \_id = productId
