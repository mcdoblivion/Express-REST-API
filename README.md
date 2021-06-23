# Express-REST-API

## Update bài tập 4: Viết một webserver cho phép request vào và hiển thị ra 1 số file tĩnh như html hoặc text từ hệ thống.

GET http://localhost:3000/ => trả về file index.html - status code 200

POST/PUT/DELETE http://localhost:3000/ => trả về text thông báo lỗi - status code 403

## Update bài tập 5: Viết một web server dạng RESTful API cho phép quản trị một danh sách các sản phẩm và cho phép thêm, sửa, xóa sản phẩm.

http://localhost:3000/products hỗ trợ GET/POST/DELETE tương ứng với các thao tác: Lấy toàn bộ thông tin sản phẩm / Thêm 1 sản phẩm / Xoá tất cả sản phẩm

http://localhost:3000/products/:productId hỗ trợ GET/PUT/DELETE tương ứng với các thao tác: Lấy thông tin sản phẩm / Sửa thông tin sản phẩm / Xoá 1 sản phẩm có \_id = productId

## Update bài tập 6: Tiếp tục từ phần 5, thêm phần quản trị users (thêm, sửa, xóa). Sau đó thêm phần login cho user để user có thể thêm sửa xóa sản phẩm.

GET http://localhost:3000/users?\_id=:userId - lấy thông tin toàn bộ user trên hệ thống nếu không truyền query strings hoặc lấy thông tin user cụ thể nếu truyền query strings \_id. Thao tác này cần quyền Admin

DELETE http://localhost:3000/users/:userId - xoá user có \_id = userId, cần quyền Admin

POST http://localhost:3000/users/signup - đăng ký user mới

POST http://localhost:3000/users/login - đăng nhập với username và password, trả về JWT

POST http://localhost:3000/users/change-password - thay đổi mật khẩu

POST http://localhost:3000/users/checkJWT - kiểm tra thông tin token
