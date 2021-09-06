# Express-REST-API

[Link to React client app](https://github.com/mcdoblivion/merchize-ecommerce) (updating)

[Client web app demo](https://merchize.cuongdm.tech)

## Latest update:

#### Users routes:

- GET /users/jwt-info - lấy info user hiện tại nếu token hợp lệ

- POST /users/account - đăng ký tài khoản với username và password

- PUT /users/account - cập nhật thông tin user 

- POST /users/account/create-jwt - lấy token để đăng nhập bằng JWT

- POST /users/change-password - đổi mật khẩu cho user đang đăng nhập

- GET /users - lấy thông tin tất cả users, cần quyền Admin

- GET/ DELETE /users/:userId - xoá user có \_id = :userId, cần quyền Admin

#### Products routes:

- GET /products[?search=abc] - tìm kiếm sản phẩm với keyword, hoặc lấy tất cả sản phẩm

- GET /products/own-products - lấy toàn bộ sản phẩm thuộc sở hữu của user đang đăng nhập

- GET /products/:productId - lấy sản phẩm có \_id=:productId

- GET /products/comments/:commentId - lấy thông tin comment có \_id=commentId

- GET /products/:productId/comments - lấy toàn bộ comments của sản phẩm có \_id=productId

- POST / DELETE /products - thêm 1 sản phẩm / xoá tất cả sản phẩm thuộc sở hữu của user đang đăng nhập

- PUT / DELETE /products/:productId - sửa / xoá sản phẩm có \_id = :productId. Sản phẩm bị sửa / xoá cần thuộc sở hữu của user đang đăng nhập

- POST /products/:productId/comments - thêm 1 comment vào sản phẩm có \_id = :productId. POST chỉ khả dụng với user đã đăng nhập và đã mua sản phẩm thành công

- PUT / DELETE /products/:productId/comments/:commentId - sửa / xoá comment có \_id = :commentId của sản phẩm có \_id = :productId. Comment bị sửa / xoá cần thuộc sở hữu của user đang đăng nhập

#### Carts routes:

- GET / POST / DELETE /carts - lấy tất cả sản phẩm trong giỏ hàng / thêm sản phẩm vào giỏ hàng / xoá giỏ hàng của user đang đăng nhập

- PUT / DELETE /carts/:productId - thay đổi số lượng / xoá sản phẩm có \_id = :productId trong giỏ hàng của user đang đăng nhập

#### Orders routes

- GET /orders[?status=-1/0/1, sellOrder=true] - lấy tất cả thông tin đơn mua hoặc lấy theo trạng thái. Lấy thông tin đơn bán sử dụng thêm tham số sellOrder=true

- POST /orders - tạo một đơn hàng

- GET /orders/:orderId - lấy thông tin đơn hàng có \_id=:orderId

- PUT /orders/:orderId?operation=cancel/confirm - thay đổi trạng thái đơn hàng (huỷ/xác nhận)

#### Upload routes

- POST /images - tải ảnh lên server và nhận lại đường dẫn, dành cho người đăng sản phẩm

- DELETE /images/:imageName - xoá ảnh có tên imageName, ảnh bị xoá cần thuộc sở hữu của user đang đăng nhập

=======================================
(All below is old)

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
