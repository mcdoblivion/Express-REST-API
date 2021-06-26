# Express-REST-API

[Link to React client app](https://github.com/mcdoblivion/merchize-ecommerce) (updating)

## Latest update:

#### Users routes:

- GET /users[?_id=userId] - lấy thông tin tất cả hoặc của user có \_id = userId, cần quyền Admin

- DELETE /users/:userId - xoá user có \_id = :userId

- POST /users/signup - đăng ký tài khoản

- POST /users/login - lấy JWT để đăng nhập

- POST /users/change-password - đổi mật khẩu cho user đang đăng nhập

- GET /users/checkJWT - kiểm tra token đang dùng có hợp lệ không

#### Products routes:

- GET /products/own-products - lấy toàn bộ sản phẩm thuộc sở hữu của user đang đăng nhập

- GET / POST / DELETE /products - lấy toàn bộ sản phẩm có trên hệ thống / thêm 1 sản phẩm / xoá tất cả sản phẩm thuộc sở hữu của user đang đăng nhập

- GET / PUT / DELETE /products/:productId - lấy / sửa / xoá sản phẩm có \_id = :productId. Sản phẩm bị sửa / xoá cần thuộc sở hữu của user đang đăng nhập

- GET / POST /products/:productId/comments - lấy tất cả comments / thêm 1 comment vào sản phẩm có \_id = :productId. POST chỉ khả dụng với user đã đăng nhập

- GET / PUT / DELETE /products/:productId/comments/:commentId - lấy / sửa / xoá comment có \_id = :commentId của sản phẩm có \_id = :productId. Comment bị sửa / xoá cần thuộc sở hữu của user đang đăng nhập

#### Carts routes:

- GET / POST / DELETE /carts - lấy tất cả sản phẩm trong giỏ hàng / thêm sản phẩm vào giỏ hàng / xoá giỏ hàng của user đang đăng nhập

- PUT / DELETE /carts/:productId - thay đổi số lượng / xoá sản phẩm có \_id = :productId trong giỏ hàng của user đang đăng nhập

#### Orders routes

- GET / POST /orders[?status=-1/0/1, sellOrder=true] - lấy tất cả thông tin đơn mua hoặc lấy theo trạng thái / thêm 1 đơn mua. Lấy thông tin đơn bán sử dụng thêm tham số sellOrder=true. Cần đăng nhập

- GET /orders/:orderId - lấy thông tin đơn hàng có \_id=:orderId, không cần đăng nhập

- PUT /orders/:orderId?operation=cancel/confirm - thay đổi trạng thái đơn hàng (huỷ/xác nhận). Cần đăng nhập

#### Upload routes

- POST /upload-image - tải ảnh lên server và nhận lại đường dẫn, dành cho người đăng sản phẩm

## Update bài tập 6: Tiếp tục từ phần 5, thêm phần quản trị users (thêm, sửa, xóa). Sau đó thêm phần login cho user để user có thể thêm sửa xóa sản phẩm.

- GET http://localhost:3000/users?\_id=:userId - lấy thông tin toàn bộ user trên hệ thống nếu không truyền query strings hoặc lấy thông tin user cụ thể nếu truyền query strings \_id. Thao tác này cần quyền Admin

- DELETE http://localhost:3000/users/:userId - xoá user có \_id = userId, cần quyền Admin

- POST http://localhost:3000/users/signup - đăng ký user mới

- POST http://localhost:3000/users/login - đăng nhập với username và password, trả về JWT

- POST http://localhost:3000/users/change-password - thay đổi mật khẩu

- POST http://localhost:3000/users/checkJWT - kiểm tra thông tin token

## Update bài tập 5: Viết một web server dạng RESTful API cho phép quản trị một danh sách các sản phẩm và cho phép thêm, sửa, xóa sản phẩm.

- http://localhost:3000/products hỗ trợ GET/POST/DELETE tương ứng với các thao tác: Lấy toàn bộ thông tin sản phẩm / Thêm 1 sản phẩm / Xoá tất cả sản phẩm

- http://localhost:3000/products/:productId hỗ trợ GET/PUT/DELETE tương ứng với các thao tác: Lấy thông tin sản phẩm / Sửa thông tin sản phẩm / Xoá 1 sản phẩm có \_id = productId

## Update bài tập 4: Viết một webserver cho phép request vào và hiển thị ra 1 số file tĩnh như html hoặc text từ hệ thống.

- GET http://localhost:3000/ => trả về file index.html - status code 200

- POST/PUT/DELETE http://localhost:3000/ => trả về text thông báo lỗi - status code 403
