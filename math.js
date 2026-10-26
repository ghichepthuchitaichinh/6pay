/* 6PAY - Toán học cấp 1 (lớp 1 – lớp 5): tổng hợp kiến thức theo chương trình GDPT 2018 và thử thách trắc nghiệm có thời gian.
   File này được index.html tải về khi người dùng mở mục Toán học. */
(function () {
  if (window.MathGame) return;
  var BEST_KEY = 'math_best_v1';
  var SEC = [0, 20, 25, 30, 40, 45];   // số giây cho mỗi câu theo lớp
  var NQ = 10;                          // số câu mỗi lượt thử thách

  /* ================= KIẾN THỨC TỪNG LỚP =================
     Mỗi lớp gồm nhiều chủ đề; mỗi chủ đề có các mục [tiêu đề, nội dung]. Nội dung dùng được thẻ <b>, <br>. */
  var K = {
  1: [
    { ic: '🔢', t: 'Các số từ 0 đến 10', it: [
      ['Đọc, viết, đếm', 'Đếm và viết các số 0, 1, 2, …, 10. Số 0 chỉ "không có gì". Số 10 là số có hai chữ số đầu tiên.'],
      ['So sánh số', 'Dùng dấu <b>&gt;</b> (lớn hơn), <b>&lt;</b> (bé hơn), <b>=</b> (bằng nhau).<br>Ví dụ: 7 &gt; 5; 3 &lt; 8; 6 = 6. Mẹo: "miệng" của dấu luôn mở về phía số lớn hơn.'],
      ['Mấy và mấy (tách – gộp số)', 'Một số có thể tách thành hai phần. Ví dụ: 8 gồm 5 và 3; 8 gồm 6 và 2; 10 gồm 4 và 6.']]},
    { ic: '➕', t: 'Phép cộng, phép trừ trong phạm vi 10', it: [
      ['Phép cộng', 'Cộng là <b>thêm vào, gộp lại</b>. Ví dụ: 4 + 3 = 7. Đổi chỗ các số hạng thì kết quả không đổi: 4 + 3 = 3 + 4.'],
      ['Phép trừ', 'Trừ là <b>bớt đi, lấy đi</b>. Ví dụ: 9 − 4 = 5. Một số trừ đi 0 bằng chính nó; một số trừ đi chính nó bằng 0.'],
      ['Mối quan hệ cộng – trừ', 'Từ 5 + 3 = 8 ta có 8 − 3 = 5 và 8 − 5 = 3.'],
      ['Bảng cộng, bảng trừ', 'Học thuộc các phép cộng, trừ trong phạm vi 10 để tính nhẩm nhanh, ví dụ 6 + 4 = 10, 10 − 7 = 3.']]},
    { ic: '💯', t: 'Các số đến 100', it: [
      ['Chục và đơn vị', 'Số có hai chữ số gồm <b>chục</b> và <b>đơn vị</b>. Ví dụ: 47 gồm 4 chục và 7 đơn vị. 10 đơn vị = 1 chục.'],
      ['Số tròn chục', '10, 20, 30, 40, 50, 60, 70, 80, 90. Số 100 đọc là "một trăm".'],
      ['So sánh số có hai chữ số', 'So sánh chữ số hàng chục trước; nếu hàng chục bằng nhau thì so sánh hàng đơn vị. Ví dụ: 52 &gt; 48; 63 &lt; 67.'],
      ['Số liền trước, liền sau', 'Số liền sau của 39 là 40; số liền trước của 40 là 39.']]},
    { ic: '✏️', t: 'Cộng, trừ (không nhớ) trong phạm vi 100', it: [
      ['Đặt tính rồi tính', 'Viết các chữ số cùng hàng thẳng cột với nhau, tính từ phải sang trái (đơn vị trước, chục sau).<br>Ví dụ: 34 + 25 = 59; 68 − 23 = 45.'],
      ['Cộng, trừ số tròn chục', '30 + 40 = 70 (3 chục + 4 chục = 7 chục); 90 − 50 = 40.']]},
    { ic: '🔺', t: 'Hình học và vị trí', it: [
      ['Hình phẳng', 'Hình vuông, hình tròn, hình tam giác (3 cạnh), hình chữ nhật.'],
      ['Khối hình', 'Khối lập phương, khối hộp chữ nhật.'],
      ['Vị trí, định hướng', 'Trên – dưới, trái – phải, trước – sau, ở giữa.']]},
    { ic: '📏', t: 'Đo lường', it: [
      ['Độ dài', 'Dài hơn – ngắn hơn, cao hơn – thấp hơn. Đo bằng gang tay, sải tay, bước chân; đơn vị đo chuẩn là <b>xăng-ti-mét (cm)</b>.'],
      ['Thời gian', 'Xem giờ đúng trên đồng hồ (kim dài chỉ số 12). Một tuần có 7 ngày: thứ Hai, thứ Ba, …, thứ Bảy, Chủ nhật.']]},
    { ic: '🧩', t: 'Giải toán có lời văn', it: [
      ['Bài toán thêm', '"Lan có 5 bông hoa, mẹ cho thêm 3 bông. Hỏi Lan có tất cả bao nhiêu bông hoa?" → 5 + 3 = 8 (bông hoa).'],
      ['Bài toán bớt', '"Có 9 con chim, 4 con bay đi. Hỏi còn lại bao nhiêu con?" → 9 − 4 = 5 (con chim).']]}
  ],
  2: [
    { ic: '🔢', t: 'Ôn tập số đến 100', it: [
      ['Tên gọi thành phần', 'Trong phép cộng: <b>số hạng + số hạng = tổng</b>. Trong phép trừ: <b>số bị trừ − số trừ = hiệu</b>.'],
      ['Nhiều hơn, ít hơn', 'Nhiều hơn thì làm phép cộng, ít hơn thì làm phép trừ. Ví dụ: An có 12 bi, Bình nhiều hơn An 5 bi → Bình có 12 + 5 = 17 bi.'],
      ['Tia số', 'Trên tia số, số đứng sau lớn hơn số đứng trước.']]},
    { ic: '➕', t: 'Phép cộng, phép trừ có nhớ', it: [
      ['Trong phạm vi 20', 'Cộng qua 10: 8 + 5 = 8 + 2 + 3 = 13. Trừ qua 10: 13 − 5 = 13 − 3 − 2 = 8.'],
      ['Trong phạm vi 100', 'Đặt tính và nhớ sang hàng chục. Ví dụ: 38 + 25 = 63 (8 + 5 = 13, viết 3 nhớ 1); 72 − 28 = 44.'],
      ['Tìm thành phần chưa biết', 'Số hạng = tổng − số hạng kia; số bị trừ = hiệu + số trừ; số trừ = số bị trừ − hiệu.']]},
    { ic: '✖️', t: 'Phép nhân, phép chia', it: [
      ['Ý nghĩa phép nhân', 'Phép nhân là phép cộng các số hạng bằng nhau: 2 + 2 + 2 = 2 × 3 = 6. Thành phần: <b>thừa số × thừa số = tích</b>.'],
      ['Ý nghĩa phép chia', 'Chia thành các phần bằng nhau. Thành phần: <b>số bị chia : số chia = thương</b>. Ví dụ: 10 : 2 = 5.'],
      ['Bảng nhân, bảng chia 2 và 5', '2 × 1 = 2, 2 × 2 = 4, …, 2 × 10 = 20. 5 × 1 = 5, …, 5 × 10 = 50. Từ 5 × 4 = 20 suy ra 20 : 5 = 4 và 20 : 4 = 5.']]},
    { ic: '💯', t: 'Các số trong phạm vi 1000', it: [
      ['Trăm, chục, đơn vị', 'Số có ba chữ số gồm trăm, chục và đơn vị. Ví dụ: 365 = 300 + 60 + 5. 10 chục = 1 trăm; 10 trăm = 1 nghìn.'],
      ['So sánh số có ba chữ số', 'So sánh hàng trăm trước, rồi đến hàng chục, cuối cùng là hàng đơn vị.'],
      ['Cộng, trừ trong phạm vi 1000', 'Ví dụ: 456 + 237 = 693; 715 − 382 = 333.']]},
    { ic: '📐', t: 'Hình học', it: [
      ['Điểm, đoạn thẳng, đường thẳng', 'Ba điểm thẳng hàng là ba điểm cùng nằm trên một đường thẳng. Phân biệt đường thẳng, đường cong.'],
      ['Đường gấp khúc', 'Độ dài đường gấp khúc bằng tổng độ dài các đoạn thẳng của nó.'],
      ['Hình và khối', 'Hình tứ giác (4 cạnh); khối trụ, khối cầu.']]},
    { ic: '📏', t: 'Đo lường', it: [
      ['Độ dài', '1 dm = 10 cm; 1 m = 10 dm = 100 cm; 1 km = 1000 m.'],
      ['Khối lượng, dung tích', 'Ki-lô-gam (kg) đo cân nặng; lít (l) đo lượng chất lỏng.'],
      ['Thời gian', '1 ngày = 24 giờ; 1 giờ = 60 phút. Xem đồng hồ khi kim phút chỉ số 3 (15 phút), số 6 (30 phút). Đọc ngày, tháng trên tờ lịch.'],
      ['Tiền Việt Nam', 'Nhận biết các tờ tiền 100, 200, 500, 1000 đồng; đổi tiền, tính tổng số tiền.']]},
    { ic: '📊', t: 'Thống kê và xác suất', it: [
      ['Biểu đồ tranh', 'Thu thập, phân loại, kiểm đếm và đọc biểu đồ tranh.'],
      ['Khả năng xảy ra', 'Dùng các từ "có thể", "chắc chắn", "không thể" để mô tả một sự việc.']]}
  ],
  3: [
    { ic: '✖️', t: 'Bảng nhân, bảng chia 2 – 9', it: [
      ['Bảng nhân', 'Thuộc lòng bảng nhân 2, 3, 4, 5, 6, 7, 8, 9. Ví dụ: 6 × 7 = 42, 8 × 9 = 72, 7 × 8 = 56.'],
      ['Bảng chia', 'Lấy tích chia cho một thừa số thì được thừa số kia: 42 : 6 = 7; 56 : 8 = 7.'],
      ['Nhân, chia với 1 và 0', 'a × 1 = a; a : 1 = a; a × 0 = 0; 0 : a = 0 (a khác 0). Không có phép chia cho 0.']]},
    { ic: '🔣', t: 'Nhân, chia số có nhiều chữ số', it: [
      ['Nhân với số có một chữ số', 'Nhân từ phải sang trái, nhớ sang hàng kế tiếp. Ví dụ: 214 × 3 = 642; 1 427 × 4 = 5 708.'],
      ['Chia cho số có một chữ số', 'Chia từ trái sang phải. Ví dụ: 846 : 2 = 423; 965 : 5 = 193.'],
      ['Phép chia có dư', 'Ví dụ: 17 : 5 = 3 (dư 2). Số dư luôn <b>bé hơn</b> số chia. Kiểm tra: 3 × 5 + 2 = 17.'],
      ['Gấp lên, giảm đi', 'Gấp một số lên nhiều lần: lấy số đó nhân với số lần. Giảm một số đi nhiều lần: lấy số đó chia cho số lần.'],
      ['Một phần mấy', 'Muốn tìm 1/3 của 12 ta lấy 12 : 3 = 4.']]},
    { ic: '🔢', t: 'Các số đến 10 000 và 100 000', it: [
      ['Đọc, viết, cấu tạo số', 'Ví dụ: 45 307 đọc là "bốn mươi lăm nghìn ba trăm linh bảy" = 40 000 + 5 000 + 300 + 7.'],
      ['Làm tròn số', 'Làm tròn đến hàng chục, trăm, nghìn: chữ số bên phải từ 5 trở lên thì làm tròn lên. Ví dụ: 4 365 làm tròn đến hàng trăm là 4 400.'],
      ['Số La Mã', 'I = 1, V = 5, X = 10. Ví dụ: IV = 4, IX = 9, XII = 12, XIX = 19, XX = 20.'],
      ['Cộng, trừ trong phạm vi 100 000', 'Đặt tính thẳng hàng, tính từ phải sang trái. Ví dụ: 36 528 + 49 347 = 85 875.']]},
    { ic: '🧮', t: 'Biểu thức số', it: [
      ['Thứ tự thực hiện', '1) Trong ngoặc trước. 2) Nhân, chia trước; cộng, trừ sau. 3) Chỉ có cộng trừ (hoặc nhân chia) thì tính từ trái sang phải.<br>Ví dụ: 20 + 5 × 4 = 20 + 20 = 40; (20 + 5) × 4 = 100.']]},
    { ic: '📐', t: 'Hình học', it: [
      ['Góc', 'Dùng ê ke để nhận biết góc vuông và góc không vuông.'],
      ['Trung điểm, hình tròn', 'Trung điểm chia đoạn thẳng thành hai phần bằng nhau. Hình tròn có tâm, bán kính, đường kính; <b>đường kính = 2 × bán kính</b>.'],
      ['Chu vi', 'Chu vi là tổng độ dài các cạnh.<br>Hình chữ nhật: <b>P = (dài + rộng) × 2</b>. Hình vuông: <b>P = cạnh × 4</b>.'],
      ['Diện tích', 'Đơn vị xăng-ti-mét vuông (cm²).<br>Hình chữ nhật: <b>S = dài × rộng</b>. Hình vuông: <b>S = cạnh × cạnh</b>.'],
      ['Khối hình', 'Khối lập phương và khối hộp chữ nhật đều có 8 đỉnh, 12 cạnh, 6 mặt.']]},
    { ic: '📏', t: 'Đo lường', it: [
      ['Đơn vị mới', '1 cm = 10 mm; 1 kg = 1000 g; 1 l = 1000 ml. Nhiệt độ đo bằng độ C (°C).'],
      ['Thời gian', 'Xem đồng hồ chính xác đến từng phút. 1 năm có 12 tháng; tháng 2 có 28 hoặc 29 ngày.'],
      ['Tiền Việt Nam', 'Nhận biết các tờ tiền đến 100 000 đồng.']]},
    { ic: '📊', t: 'Thống kê và xác suất', it: [
      ['Bảng số liệu', 'Đọc, mô tả và so sánh số liệu trong bảng.'],
      ['Khả năng xảy ra', 'Nhận biết khả năng xảy ra của một sự kiện khi tung đồng xu, gieo xúc xắc.']]}
  ],
  4: [
    { ic: '🔢', t: 'Số có nhiều chữ số', it: [
      ['Hàng và lớp', 'Lớp đơn vị (đơn vị, chục, trăm), lớp nghìn (nghìn, chục nghìn, trăm nghìn), lớp triệu (triệu, chục triệu, trăm triệu).<br>Ví dụ: 3 517 246: chữ số 5 thuộc hàng trăm nghìn.'],
      ['Làm tròn, so sánh', 'Làm tròn số đến hàng trăm nghìn; so sánh số có nhiều chữ số: số nào nhiều chữ số hơn thì lớn hơn.'],
      ['Số chẵn, số lẻ', 'Số chẵn có chữ số tận cùng là 0, 2, 4, 6, 8; số lẻ có tận cùng là 1, 3, 5, 7, 9.']]},
    { ic: '🧮', t: 'Bốn phép tính với số tự nhiên', it: [
      ['Tính chất phép tính', 'Giao hoán: a + b = b + a; a × b = b × a.<br>Kết hợp: (a + b) + c = a + (b + c); (a × b) × c = a × (b × c).<br>Nhân một số với một tổng: a × (b + c) = a × b + a × c.'],
      ['Nhân với số có hai chữ số', 'Ví dụ: 36 × 23 = 36 × 20 + 36 × 3 = 720 + 108 = 828.'],
      ['Chia cho số có hai chữ số', 'Ví dụ: 672 : 21 = 32. Ước lượng thương bằng cách làm tròn số chia.'],
      ['Nhân, chia nhẩm', 'Nhân với 10, 100, 1000: thêm 1, 2, 3 chữ số 0. Chia số tròn chục, tròn trăm cho 10, 100: bớt chữ số 0.']]},
    { ic: '🧩', t: 'Các dạng toán điển hình', it: [
      ['Trung bình cộng', 'Muốn tìm số trung bình cộng của nhiều số, ta tính tổng các số rồi chia cho số các số hạng.<br>Ví dụ: TBC của 12, 15, 18 là (12 + 15 + 18) : 3 = 15.'],
      ['Tổng và hiệu', '<b>Số lớn = (Tổng + Hiệu) : 2</b>; <b>Số bé = (Tổng − Hiệu) : 2</b>.<br>Ví dụ: tổng 50, hiệu 10 → số lớn 30, số bé 20.'],
      ['Rút về đơn vị', '3 hộp có 24 cái bút → 1 hộp có 24 : 3 = 8 cái → 5 hộp có 8 × 5 = 40 cái.']]},
    { ic: '🍕', t: 'Phân số', it: [
      ['Khái niệm', 'Phân số a/b: a là tử số, b là mẫu số (b khác 0). Mọi số tự nhiên đều viết được thành phân số có mẫu số là 1.'],
      ['Tính chất cơ bản', 'Nhân (hoặc chia) cả tử và mẫu với cùng một số khác 0 thì được phân số bằng nó. Dùng để <b>rút gọn</b> và <b>quy đồng mẫu số</b>.<br>Ví dụ: 6/8 = 3/4.'],
      ['So sánh phân số', 'Cùng mẫu số: tử nào lớn hơn thì lớn hơn. Khác mẫu số: quy đồng rồi so sánh.'],
      ['Cộng, trừ phân số', 'Cùng mẫu: cộng (trừ) tử, giữ nguyên mẫu: 2/7 + 3/7 = 5/7. Khác mẫu: quy đồng mẫu số trước.'],
      ['Nhân, chia phân số', 'a/b × c/d = (a × c)/(b × d). Chia: nhân với phân số đảo ngược: a/b : c/d = a/b × d/c.']]},
    { ic: '📐', t: 'Hình học', it: [
      ['Các loại góc', 'Góc nhọn (bé hơn góc vuông), góc vuông (90°), góc tù (lớn hơn góc vuông), góc bẹt (180°). Đo góc bằng thước đo góc, đơn vị là độ (°).'],
      ['Đường thẳng vuông góc, song song', 'Hai đường thẳng vuông góc tạo thành 4 góc vuông. Hai đường thẳng song song không bao giờ cắt nhau.'],
      ['Hình bình hành, hình thoi', 'Hình bình hành có hai cặp cạnh đối diện song song và bằng nhau. Hình thoi có bốn cạnh bằng nhau.']]},
    { ic: '📏', t: 'Đo lường', it: [
      ['Khối lượng', '1 yến = 10 kg; 1 tạ = 100 kg; 1 tấn = 1000 kg.'],
      ['Diện tích', '1 dm² = 100 cm²; 1 m² = 100 dm²; 1 cm² = 100 mm².'],
      ['Thời gian', '1 phút = 60 giây; 1 thế kỉ = 100 năm. Năm 2026 thuộc thế kỉ XXI.']]},
    { ic: '📊', t: 'Thống kê và xác suất', it: [
      ['Dãy số liệu, biểu đồ cột', 'Đọc, mô tả và nhận xét biểu đồ cột.'],
      ['Số lần lặp lại', 'Kiểm đếm số lần xuất hiện của một khả năng trong một thí nghiệm, trò chơi.']]}
  ],
  5: [
    { ic: '🍕', t: 'Ôn tập phân số, hỗn số', it: [
      ['Phân số thập phân', 'Phân số có mẫu số là 10, 100, 1000, … Ví dụ: 3/10, 27/100.'],
      ['Hỗn số', 'Hỗn số gồm phần nguyên và phần phân số: 2 3/4 = (2 × 4 + 3)/4 = 11/4.']]},
    { ic: '🔟', t: 'Số thập phân', it: [
      ['Cấu tạo', 'Số thập phân gồm phần nguyên và phần thập phân, ngăn cách bởi dấu phẩy. Ví dụ: 12,35 = 12 + 3/10 + 5/100. Thêm chữ số 0 vào bên phải phần thập phân thì giá trị không đổi: 0,5 = 0,50.'],
      ['So sánh', 'So sánh phần nguyên trước; phần nguyên bằng nhau thì so sánh từng hàng của phần thập phân. Ví dụ: 2,7 &gt; 2,65.'],
      ['Cộng, trừ', 'Đặt tính sao cho các dấu phẩy thẳng cột. Ví dụ: 4,35 + 2,8 = 7,15.'],
      ['Nhân, chia', 'Nhân như số tự nhiên rồi đếm chữ số ở phần thập phân để đặt dấu phẩy: 1,2 × 0,3 = 0,36.<br>Nhân với 10, 100: dời dấu phẩy sang phải 1, 2 chữ số. Chia cho 10, 100 (hoặc nhân với 0,1; 0,01): dời sang trái.']]},
    { ic: '💯', t: 'Tỉ số và tỉ số phần trăm', it: [
      ['Tỉ số phần trăm của hai số', 'Lấy a chia b rồi nhân 100 và viết thêm %. Ví dụ: 15 và 60 → 15 : 60 = 0,25 = 25%.'],
      ['Tìm giá trị phần trăm', 'Muốn tìm 20% của 150: 150 × 20 : 100 = 30.'],
      ['Tổng – tỉ và hiệu – tỉ', 'Tổng hai số là 40, tỉ số là 3/5 → tổng số phần bằng nhau là 3 + 5 = 8; số bé = 40 : 8 × 3 = 15; số lớn = 25.<br>Hiệu – tỉ: lấy hiệu chia cho hiệu số phần.'],
      ['Tỉ lệ bản đồ', 'Tỉ lệ 1 : 1000 nghĩa là 1 cm trên bản đồ ứng với 1000 cm (10 m) ngoài thực tế.']]},
    { ic: '📐', t: 'Hình học', it: [
      ['Hình tam giác', 'Có đáy và đường cao. <b>S = đáy × chiều cao : 2</b>.'],
      ['Hình thang', 'Có hai đáy song song. <b>S = (đáy lớn + đáy bé) × chiều cao : 2</b>.'],
      ['Hình tròn', 'Chu vi: <b>C = d × 3,14</b> hoặc <b>C = r × 2 × 3,14</b>. Diện tích: <b>S = r × r × 3,14</b>.'],
      ['Hình hộp chữ nhật', 'Diện tích xung quanh = (dài + rộng) × 2 × cao. Diện tích toàn phần = xung quanh + 2 đáy. <b>Thể tích V = dài × rộng × cao</b>.'],
      ['Hình lập phương', 'Diện tích xung quanh = cạnh × cạnh × 4; toàn phần = cạnh × cạnh × 6. <b>Thể tích V = cạnh × cạnh × cạnh</b>.']]},
    { ic: '📏', t: 'Đo lường', it: [
      ['Bảng đơn vị đo', 'Độ dài, khối lượng: hai đơn vị liền nhau hơn kém <b>10 lần</b>. Diện tích: hơn kém <b>100 lần</b> (1 ha = 10 000 m²; 1 km² = 100 ha). Thể tích: hơn kém <b>1000 lần</b> (1 m³ = 1000 dm³; 1 dm³ = 1000 cm³ = 1 lít).'],
      ['Số đo thời gian', 'Cộng, trừ, nhân, chia số đo thời gian. Ví dụ: 2 giờ 45 phút + 1 giờ 30 phút = 4 giờ 15 phút.'],
      ['Vận tốc, quãng đường, thời gian', '<b>v = s : t</b>; <b>s = v × t</b>; <b>t = s : v</b>. Ví dụ: ô tô đi 120 km trong 3 giờ → vận tốc 40 km/giờ.']]},
    { ic: '📊', t: 'Thống kê và xác suất', it: [
      ['Biểu đồ hình quạt tròn', 'Đọc và mô tả số liệu biểu diễn bằng tỉ số phần trăm trên biểu đồ hình quạt tròn.'],
      ['Tỉ số mô tả số lần lặp lại', 'Ví dụ: tung đồng xu 20 lần, 9 lần mặt ngửa → tỉ số 9/20.']]}
  ]};

  /* ================= TẠO CÂU HỎI THỬ THÁCH (số ngẫu nhiên, không bao giờ hết câu) ================= */
  function R(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pickA(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function N(x, d) { return Number(x).toLocaleString('vi-VN', { maximumFractionDigits: d === undefined ? 2 : d }); }
  function round2(x) { return Math.round(x * 100) / 100; }
  // đáp án số: tự tạo 3 phương án gần đúng
  function numQ(q, ans, ex, unit, spread) {
    unit = unit || ''; var s = spread || Math.max(1, Math.round(Math.abs(ans) * 0.1));
    var set = {}, w = [], tries = 0; set[ans] = 1;
    var cand = [ans + 1, ans - 1, ans + 10, ans - 10, ans + s, ans - s, ans + 2 * s, ans * 2, Math.round(ans / 2)];
    cand = shuffle(cand);
    for (var i = 0; i < cand.length && w.length < 3; i++) { var c = round2(cand[i]); if (c >= 0 && !set[c]) { set[c] = 1; w.push(c); } }
    while (w.length < 3 && tries++ < 50) { var c2 = round2(ans + R(-3 * s - 3, 3 * s + 3)); if (c2 >= 0 && !set[c2]) { set[c2] = 1; w.push(c2); } }
    return { q: q, a: N(ans) + unit, w: w.map(function (x) { return N(x) + unit; }), ex: ex };
  }
  function txtQ(q, a, w, ex) { return { q: q, a: a, w: w.slice(0, 3), ex: ex }; }
  function frac(a, b) { return a + '/' + b; }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  var GEN = {
  1: [
    function () { var a = R(0, 10), b = R(0, 10 - a); return numQ(a + ' + ' + b + ' = ?', a + b, a + ' thêm ' + b + ' bằng ' + (a + b) + '.', '', 1); },
    function () { var a = R(1, 10), b = R(0, a); return numQ(a + ' − ' + b + ' = ?', a - b, a + ' bớt ' + b + ' còn ' + (a - b) + '.', '', 1); },
    function () { var a = R(10, 99), b = R(10, 99); while (a === b) b = R(10, 99); var s = a > b ? '>' : '<';
      return txtQ('Điền dấu thích hợp: ' + a + ' ... ' + b, s, s === '>' ? ['<', '='] .concat(['không so sánh được']) : ['>', '=', 'không so sánh được'], 'So sánh hàng chục trước, rồi đến hàng đơn vị: ' + a + ' ' + s + ' ' + b + '.'); },
    function () { var t = R(1, 8), u1 = R(0, 9 - 0), b1 = R(1, 9 - t), u2 = R(0, 9 - u1); var a = t * 10 + u1, b = b1 * 10 + u2;
      return numQ(a + ' + ' + b + ' = ?', a + b, 'Cộng đơn vị: ' + u1 + ' + ' + u2 + ' = ' + (u1 + u2) + '; cộng chục: ' + t + ' + ' + b1 + ' = ' + (t + b1) + '.', '', 1); },
    function () { var t = R(2, 9), u = R(0, 9), t2 = R(1, t - 1), u2 = R(0, u); var a = t * 10 + u, b = t2 * 10 + u2;
      return numQ(a + ' − ' + b + ' = ?', a - b, 'Trừ đơn vị: ' + u + ' − ' + u2 + ' = ' + (u - u2) + '; trừ chục: ' + t + ' − ' + t2 + ' = ' + (t - t2) + '.', '', 1); },
    function () { var n = R(11, 99), t = Math.floor(n / 10), u = n % 10;
      return txtQ('Số ' + n + ' gồm mấy chục và mấy đơn vị?', t + ' chục và ' + u + ' đơn vị', [u + ' chục và ' + t + ' đơn vị', (t + 1) + ' chục và ' + u + ' đơn vị', t + ' chục và ' + ((u + 1) % 10) + ' đơn vị'], n + ' = ' + t * 10 + ' + ' + u + '.'); },
    function () { var n = R(1, 98); return numQ('Số liền sau của ' + n + ' là số nào?', n + 1, 'Số liền sau lớn hơn số đã cho 1 đơn vị.', '', 1); },
    function () { var s = pickA([['hình tam giác', 3], ['hình vuông', 4], ['hình chữ nhật', 4]]);
      return numQ(s[0].charAt(0).toUpperCase() + s[0].slice(1) + ' có mấy cạnh?', s[1], s[0] + ' có ' + s[1] + ' cạnh.', '', 1); },
    function () { var a = R(2, 7), b = R(1, 10 - a), who = pickA(['Lan', 'Minh', 'Hoa', 'Nam']), it = pickA(['cái kẹo', 'quyển vở', 'bông hoa', 'viên bi']);
      return numQ(who + ' có ' + a + ' ' + it + ', mẹ cho thêm ' + b + ' ' + it + '. Hỏi ' + who + ' có tất cả bao nhiêu ' + it + '?', a + b, a + ' + ' + b + ' = ' + (a + b) + ' (' + it + ').', '', 1); },
    function () { var a = R(5, 10), b = R(1, a - 1);
      return numQ('Trên cành có ' + a + ' con chim, ' + b + ' con bay đi. Hỏi còn lại mấy con chim?', a - b, a + ' − ' + b + ' = ' + (a - b) + ' (con chim).', '', 1); },
    function () { var h = R(1, 12); return numQ('Kim ngắn chỉ số ' + h + ', kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?', h, 'Kim dài chỉ số 12 là giờ đúng; kim ngắn chỉ số giờ.', ' giờ', 1); }
  ],
  2: [
    function () { var a = R(15, 79), b = R(11, 99 - a); if ((a % 10) + (b % 10) < 10) b = Math.min(99 - a, b + (10 - (a % 10) - (b % 10))); return numQ(a + ' + ' + b + ' = ?', a + b, 'Đặt tính, cộng đơn vị trước (nhớ 1 sang hàng chục nếu được 10 trở lên).', '', 2); },
    function () { var a = R(31, 99), b = R(11, a - 10); return numQ(a + ' − ' + b + ' = ?', a - b, 'Đặt tính, trừ đơn vị trước (mượn 1 chục nếu không trừ được).', '', 2); },
    function () { var t = pickA([2, 5]), k = R(1, 10); return numQ(t + ' × ' + k + ' = ?', t * k, 'Bảng nhân ' + t + ': ' + t + ' × ' + k + ' = ' + t * k + '.', '', t); },
    function () { var t = pickA([2, 5]), k = R(1, 10); return numQ(t * k + ' : ' + t + ' = ?', k, 'Vì ' + t + ' × ' + k + ' = ' + t * k + ' nên ' + t * k + ' : ' + t + ' = ' + k + '.', '', 1); },
    function () { var u = pickA([['1 m', 100, 'cm'], ['1 dm', 10, 'cm'], ['1 km', 1000, 'm'], ['1 m', 10, 'dm'], ['1 giờ', 60, 'phút'], ['1 ngày', 24, 'giờ']]);
      return txtQ(u[0] + ' = ? ' + u[2], N(u[1]) + ' ' + u[2], [N(u[1] * 10) + ' ' + u[2], N(u[1] / 10 >= 1 ? u[1] / 10 : u[1] * 100) + ' ' + u[2], N(u[1] + 10) + ' ' + u[2]], u[0] + ' = ' + N(u[1]) + ' ' + u[2] + '.'); },
    function () { var a = R(101, 999), b = R(101, 999); while (a === b) b = R(101, 999); var s = a > b ? '>' : '<';
      return txtQ('Điền dấu: ' + a + ' ... ' + b, s, [s === '>' ? '<' : '>', '=', 'không so sánh được'], 'So sánh hàng trăm, rồi hàng chục, rồi hàng đơn vị.'); },
    function () { var n = R(101, 999), h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, u = n % 10;
      return txtQ('Số gồm ' + h + ' trăm, ' + t + ' chục và ' + u + ' đơn vị là số nào?', '' + n, ['' + (u * 100 + t * 10 + h), '' + (h * 100 + u * 10 + t), '' + (h * 10 + t)].filter(function (x) { return x !== '' + n; }).concat(['' + (n + 10)]), n + ' = ' + h * 100 + ' + ' + t * 10 + ' + ' + u + '.'); },
    function () { var a = R(20, 60), d = R(5, 20), who = pickA(['An', 'Bình', 'Chi']);
      return numQ('Lớp 2A có ' + a + ' học sinh, lớp 2B nhiều hơn lớp 2A ' + d + ' học sinh. Hỏi lớp 2B có bao nhiêu học sinh?', a + d, 'Nhiều hơn → làm phép cộng: ' + a + ' + ' + d + ' = ' + (a + d) + '.', '', 3); },
    function () { var k = R(2, 9), t = pickA([2, 5]); return numQ('Mỗi bạn có ' + t + ' cái bút. Hỏi ' + k + ' bạn có tất cả bao nhiêu cái bút?', t * k, t + ' × ' + k + ' = ' + t * k + ' (cái bút).', '', t); },
    function () { var a = R(2, 5), b = R(2, 5), c = R(2, 5); return numQ('Đường gấp khúc gồm ba đoạn dài ' + a + ' cm, ' + b + ' cm và ' + c + ' cm. Độ dài đường gấp khúc là bao nhiêu?', a + b + c, a + ' + ' + b + ' + ' + c + ' = ' + (a + b + c) + ' cm.', ' cm', 1); }
  ],
  3: [
    function () { var a = R(2, 9), b = R(2, 9); return numQ(a + ' × ' + b + ' = ?', a * b, 'Bảng nhân ' + a + ': ' + a + ' × ' + b + ' = ' + a * b + '.', '', a); },
    function () { var a = R(2, 9), b = R(2, 9); return numQ(a * b + ' : ' + a + ' = ?', b, 'Vì ' + a + ' × ' + b + ' = ' + a * b + '.', '', 1); },
    function () { var a = R(102, 330), b = R(2, 3); return numQ(a + ' × ' + b + ' = ?', a * b, 'Nhân từ phải sang trái.', '', 10); },
    function () { var b = R(3, 9), q = R(2, 9), r = R(1, b - 1), a = b * q + r;
      return txtQ(a + ' : ' + b + ' = ?', q + ' (dư ' + r + ')', [q + ' (dư ' + (r + b) + ')', (q + 1) + ' (dư ' + r + ')', (q - 1) + ' (dư ' + (r + b) + ')'], 'Kiểm tra: ' + q + ' × ' + b + ' + ' + r + ' = ' + a + '; số dư ' + r + ' bé hơn số chia ' + b + '.'); },
    function () { var a = R(10, 50), b = R(2, 9), c = R(2, 9); return numQ(a + ' + ' + b + ' × ' + c + ' = ?', a + b * c, 'Nhân trước, cộng sau: ' + b + ' × ' + c + ' = ' + b * c + '; ' + a + ' + ' + b * c + ' = ' + (a + b * c) + '.', '', 5); },
    function () { var a = R(2, 9), b = R(2, 9), c = R(2, 6); return numQ('(' + a + ' + ' + b + ') × ' + c + ' = ?', (a + b) * c, 'Tính trong ngoặc trước: ' + (a + b) + ' × ' + c + ' = ' + (a + b) * c + '.', '', 5); },
    function () { var d = R(5, 20), r = R(2, d - 1); return numQ('Hình chữ nhật có chiều dài ' + d + ' cm, chiều rộng ' + r + ' cm. Chu vi là bao nhiêu?', (d + r) * 2, 'P = (' + d + ' + ' + r + ') × 2 = ' + (d + r) * 2 + ' cm.', ' cm', 4); },
    function () { var d = R(4, 12), r = R(2, d - 1); return numQ('Hình chữ nhật có chiều dài ' + d + ' cm, chiều rộng ' + r + ' cm. Diện tích là bao nhiêu?', d * r, 'S = ' + d + ' × ' + r + ' = ' + d * r + ' cm².', ' cm²', 5); },
    function () { var a = R(3, 12); return numQ('Hình vuông có cạnh ' + a + ' cm. Chu vi là bao nhiêu?', a * 4, 'P = ' + a + ' × 4 = ' + a * 4 + ' cm.', ' cm', 4); },
    function () { var k = R(2, 9), q = R(2, 12), n = k * q; return numQ('1/' + k + ' của ' + n + ' là bao nhiêu?', q, 'Lấy ' + n + ' : ' + k + ' = ' + q + '.', '', 2); },
    function () { var n = R(1100, 9899), p = pickA([10, 100, 1000]), r = Math.round(n / p) * p, name = { 10: 'chục', 100: 'trăm', 1000: 'nghìn' }[p];
      return txtQ('Làm tròn số ' + N(n) + ' đến hàng ' + name + ' ta được số nào?', N(r), [N(r + p), N(r - p), N(Math.floor(n / p) * p === r ? r + p * 2 : Math.floor(n / p) * p)], 'Xét chữ số ngay bên phải hàng ' + name + ': từ 5 trở lên thì làm tròn lên, dưới 5 thì làm tròn xuống.'); },
    function () { var m = pickA([['IV', 4], ['IX', 9], ['XI', 11], ['XIV', 14], ['XIX', 19], ['XX', 20], ['VI', 6], ['XII', 12], ['VIII', 8], ['XV', 15]]);
      return numQ('Số La Mã ' + m[0] + ' là số nào?', m[1], 'I = 1, V = 5, X = 10; chữ số nhỏ đứng trước chữ số lớn thì trừ, đứng sau thì cộng.', '', 1); },
    function () { var u = pickA([['1 kg', 1000, 'g'], ['1 cm', 10, 'mm'], ['1 l', 1000, 'ml'], ['1 năm', 12, 'tháng'], ['1 m', 1000, 'mm']]);
      return txtQ(u[0] + ' = ? ' + u[2], N(u[1]) + ' ' + u[2], [N(u[1] * 10) + ' ' + u[2], N(u[1] / 10) + ' ' + u[2], N(u[1] + 100) + ' ' + u[2]], u[0] + ' = ' + N(u[1]) + ' ' + u[2] + '.'); },
    function () { var a = R(3, 12), k = R(2, 6); return numQ('Gấp ' + a + ' lên ' + k + ' lần được bao nhiêu?', a * k, a + ' × ' + k + ' = ' + a * k + '.', '', a); }
  ],
  4: [
    function () { var d = [R(1, 9), R(0, 9), R(0, 9), R(0, 9), R(0, 9), R(0, 9), R(0, 9)], n = +d.join(''), names = ['triệu', 'trăm nghìn', 'chục nghìn', 'nghìn', 'trăm', 'chục', 'đơn vị'];
      var pos = R(0, 6), dg = d[pos];
      return txtQ('Trong số ' + N(n) + ', chữ số ở hàng ' + names[pos] + ' là chữ số nào?', '' + dg, shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (x) { return x !== dg; })).slice(0, 3).map(String), 'Từ phải sang trái: đơn vị, chục, trăm, nghìn, chục nghìn, trăm nghìn, triệu.'); },
    function () { var a = R(21, 89), b = R(12, 49); return numQ(a + ' × ' + b + ' = ?', a * b, a + ' × ' + b + ' = ' + a + ' × ' + Math.floor(b / 10) * 10 + ' + ' + a + ' × ' + (b % 10) + '.', '', 10); },
    function () { var b = R(12, 45), q = R(12, 60); return numQ(b * q + ' : ' + b + ' = ?', q, 'Thử lại: ' + q + ' × ' + b + ' = ' + b * q + '.', '', 2); },
    function () { var n = 3, x = [R(10, 50), R(10, 50), 0]; var t = R(10, 50); x[2] = t; var s = x[0] + x[1] + x[2]; var m = s % 3; x[2] += (3 - m) % 3; s = x[0] + x[1] + x[2];
      return numQ('Trung bình cộng của ' + x.join(', ') + ' là bao nhiêu?', s / 3, '(' + x.join(' + ') + ') : 3 = ' + s + ' : 3 = ' + s / 3 + '.', '', 3); },
    function () { var big = R(20, 80), small = R(5, big - 5), T = big + small, H = big - small;
      return numQ('Tổng của hai số là ' + T + ', hiệu là ' + H + '. Số lớn là bao nhiêu?', big, 'Số lớn = (Tổng + Hiệu) : 2 = (' + T + ' + ' + H + ') : 2 = ' + big + '.', '', 5); },
    function () { var b = R(2, 9), a = R(1, b - 1), k = R(2, 5), g = gcd(a, b); a /= g; b /= g;
      return txtQ('Rút gọn phân số ' + frac(a * k, b * k), frac(a, b), [frac(a * k, b), frac(a, b * k), frac(b, a)], 'Chia cả tử và mẫu cho ' + k + (g > 1 ? ' (rồi rút gọn tiếp)' : '') + '.'); },
    function () { var m = R(5, 15), a = R(1, m - 2), b = R(1, m - a - 1); return txtQ(frac(a, m) + ' + ' + frac(b, m) + ' = ?', frac(a + b, m), [frac(a + b, m + m), frac(a + b + 1, m), frac(a * b, m)], 'Cùng mẫu số: cộng hai tử số, giữ nguyên mẫu số.'); },
    function () { var m = R(5, 12), a = R(1, m - 1), b = R(1, m - 1); while (a === b) b = R(1, m - 1);
      return txtQ('Phân số nào lớn hơn: ' + frac(a, m) + ' hay ' + frac(b, m) + '?', frac(Math.max(a, b), m), [frac(Math.min(a, b), m), 'Hai phân số bằng nhau', 'Không so sánh được'], 'Cùng mẫu số, phân số nào có tử lớn hơn thì lớn hơn.'); },
    function () { var g = pickA([['nhỏ hơn góc vuông', 'Góc nhọn'], ['bằng 90°', 'Góc vuông'], ['lớn hơn góc vuông và nhỏ hơn góc bẹt', 'Góc tù'], ['bằng 180°', 'Góc bẹt']]);
      return txtQ('Góc ' + g[0] + ' gọi là góc gì?', g[1], ['Góc nhọn', 'Góc vuông', 'Góc tù', 'Góc bẹt'].filter(function (x) { return x !== g[1]; }), 'Góc nhọn < góc vuông (90°) < góc tù < góc bẹt (180°).'); },
    function () { var u = pickA([['1 tấn', 1000, 'kg'], ['1 tạ', 100, 'kg'], ['1 yến', 10, 'kg'], ['1 m²', 100, 'dm²'], ['1 dm²', 100, 'cm²'], ['1 thế kỉ', 100, 'năm'], ['1 phút', 60, 'giây']]);
      return txtQ(u[0] + ' = ? ' + u[2], N(u[1]) + ' ' + u[2], [N(u[1] * 10) + ' ' + u[2], N(u[1] / 10) + ' ' + u[2], N(u[1] === 60 ? 100 : u[1] + 50) + ' ' + u[2]], u[0] + ' = ' + N(u[1]) + ' ' + u[2] + '.'); },
    function () { var a = R(3, 9), b = R(2, 9); return txtQ(frac(a, b) + ' × ' + b + ' = ?', '' + a, [frac(a, b * b), '' + (a * b), frac(a + b, b)], frac(a, b) + ' × ' + b + ' = ' + frac(a * b, b) + ' = ' + a + '.'); },
    function () { var n = R(1000, 99999); var even = n % 2 === 0; return txtQ('Số ' + N(n) + ' là số chẵn hay số lẻ?', even ? 'Số chẵn' : 'Số lẻ', [even ? 'Số lẻ' : 'Số chẵn', 'Vừa chẵn vừa lẻ', 'Không xác định được'], 'Chữ số tận cùng là ' + (n % 10) + '.'); }
  ],
  5: [
    function () { var a = R(100, 999) / 100, b = R(10, 99) / 10; return numQ(N(a) + ' + ' + N(b) + ' = ?', round2(a + b), 'Đặt tính sao cho các dấu phẩy thẳng cột.', '', 1); },
    function () { var a = R(500, 999) / 100, b = R(100, 499) / 100; return numQ(N(a) + ' − ' + N(b) + ' = ?', round2(a - b), 'Đặt tính sao cho các dấu phẩy thẳng cột.', '', 1); },
    function () { var a = R(11, 49) / 10, b = R(2, 9); return numQ(N(a) + ' × ' + b + ' = ?', round2(a * b), 'Nhân như số tự nhiên rồi đặt dấu phẩy.', '', 1); },
    function () { var a = R(1001, 9999) / 100, p = pickA([10, 100]); return txtQ(N(a) + ' × ' + p + ' = ?', N(round2(a * p)), [N(round2(a * p / 100 === a ? a * 1000 : a * (p === 10 ? 100 : 10))), N(round2(a / p), 4), N(round2(a * p) + 1)], 'Nhân với ' + p + ': dời dấu phẩy sang phải ' + (p === 10 ? 1 : 2) + ' chữ số.'); },
    function () { var p = pickA([10, 20, 25, 30, 40, 50, 75]), n = pickA([40, 60, 80, 120, 200, 240, 400]); return numQ(p + '% của ' + n + ' là bao nhiêu?', n * p / 100, n + ' × ' + p + ' : 100 = ' + N(n * p / 100) + '.', '', 5); },
    function () { var b = pickA([20, 25, 40, 50, 80]), pct = pickA([10, 20, 25, 40, 50, 60, 75]), a = b * pct / 100; return txtQ('Tỉ số phần trăm của ' + N(a) + ' và ' + b + ' là bao nhiêu?', pct + '%', [(pct + 10) + '%', (pct / 2) + '%', N(a / b, 2) + '%'], N(a) + ' : ' + b + ' = ' + N(a / b) + ' = ' + pct + '%.'); },
    function () { var d = R(4, 20), h = R(2, 12); if (d * h % 2) d++; return numQ('Tam giác có đáy ' + d + ' cm, chiều cao ' + h + ' cm. Diện tích là bao nhiêu?', d * h / 2, 'S = ' + d + ' × ' + h + ' : 2 = ' + d * h / 2 + ' cm².', ' cm²', 4); },
    function () { var a = R(6, 15), b = R(2, a - 1), h = R(2, 10); if ((a + b) * h % 2) h++; return numQ('Hình thang có hai đáy ' + a + ' cm và ' + b + ' cm, chiều cao ' + h + ' cm. Diện tích là bao nhiêu?', (a + b) * h / 2, 'S = (' + a + ' + ' + b + ') × ' + h + ' : 2 = ' + (a + b) * h / 2 + ' cm².', ' cm²', 5); },
    function () { var r = R(1, 10); return numQ('Hình tròn có bán kính ' + r + ' cm. Chu vi là bao nhiêu?', round2(r * 2 * 3.14), 'C = r × 2 × 3,14 = ' + r + ' × 2 × 3,14 = ' + N(round2(r * 2 * 3.14)) + ' cm.', ' cm', 3.14); },
    function () { var r = R(1, 10); return numQ('Hình tròn có bán kính ' + r + ' cm. Diện tích là bao nhiêu?', round2(r * r * 3.14), 'S = r × r × 3,14 = ' + N(round2(r * r * 3.14)) + ' cm².', ' cm²', 3.14); },
    function () { var a = R(3, 10), b = R(2, 8), c = R(2, 6); return numQ('Hình hộp chữ nhật dài ' + a + ' cm, rộng ' + b + ' cm, cao ' + c + ' cm. Thể tích là bao nhiêu?', a * b * c, 'V = ' + a + ' × ' + b + ' × ' + c + ' = ' + a * b * c + ' cm³.', ' cm³', 10); },
    function () { var a = R(2, 9); return numQ('Hình lập phương cạnh ' + a + ' cm có thể tích là bao nhiêu?', a * a * a, 'V = ' + a + ' × ' + a + ' × ' + a + ' = ' + a * a * a + ' cm³.', ' cm³', 10); },
    function () { var v = pickA([30, 35, 40, 45, 50, 60]), t = R(2, 5); return numQ('Ô tô đi được ' + v * t + ' km trong ' + t + ' giờ. Vận tốc của ô tô là bao nhiêu?', v, 'v = s : t = ' + v * t + ' : ' + t + ' = ' + v + ' km/giờ.', ' km/giờ', 5); },
    function () { var a = R(2, 5), b = R(a + 1, 9), k = R(3, 8), T = (a + b) * k;
      return numQ('Tổng của hai số là ' + T + ', số bé bằng ' + frac(a, b) + ' số lớn. Số bé là bao nhiêu?', a * k, 'Tổng số phần: ' + a + ' + ' + b + ' = ' + (a + b) + '; số bé = ' + T + ' : ' + (a + b) + ' × ' + a + ' = ' + a * k + '.', '', k); },
    function () { var u = pickA([['1 ha', 10000, 'm²'], ['1 km²', 100, 'ha'], ['1 m³', 1000, 'dm³'], ['1 dm³', 1000, 'cm³'], ['1 tấn', 1000, 'kg'], ['1 giờ', 3600, 'giây']]);
      return txtQ(u[0] + ' = ? ' + u[2], N(u[1]) + ' ' + u[2], [N(u[1] * 10) + ' ' + u[2], N(u[1] / 10) + ' ' + u[2], N(u[1] / 100) + ' ' + u[2]], u[0] + ' = ' + N(u[1]) + ' ' + u[2] + '.'); },
    function () { var a = R(1, 4), n = R(1, 4), d = R(n + 1, 7); return txtQ('Viết hỗn số ' + a + ' ' + frac(n, d) + ' thành phân số', frac(a * d + n, d), [frac(a + n, d), frac(a * n + d, d), frac(a * d + n, d * a)], '(' + a + ' × ' + d + ' + ' + n + ')/' + d + ' = ' + frac(a * d + n, d) + '.'); }
  ]};

  function makeQuiz(g) {
    var gens = GEN[g], out = [], seen = {}, order = [];
    while (out.length < NQ) {
      if (!order.length) order = shuffle(gens.map(function (f, i) { return i; }));
      var q = gens[order.pop()]();
      var w = []; q.w.forEach(function (x) { if (x !== q.a && w.indexOf(x) < 0) w.push(x); });
      if (w.length < 3 || seen[q.q]) continue;
      seen[q.q] = 1; q.w = w.slice(0, 3); q.o = shuffle([q.a].concat(q.w)); out.push(q);
    }
    return out;
  }

  /* ================= LƯU KỶ LỤC ================= */
  function bests() { try { return JSON.parse(localStorage.getItem(BEST_KEY)) || {}; } catch (e) { return {}; } }
  function setBest(g, v) { var b = bests(); if (!b[g] || v > b[g]) { b[g] = v; try { localStorage.setItem(BEST_KEY, JSON.stringify(b)); } catch (e) {} return true; } return false; }
  function sfx(k) { try { if (window.sfx) window.sfx(k); } catch (e) {} }

  /* ================= GIAO DIỆN ================= */
  var COL = ['', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'];
  var ICO = ['', '🐣', '🧸', '🚀', '🦉', '🎓'];
  var st = document.createElement('style');
  st.textContent =
  '#mtOv{position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;background:linear-gradient(180deg,#fff7e6,#ffe8cc);color:#3b2a14;font-family:"Be Vietnam Pro",-apple-system,"Segoe UI",Roboto,Arial,sans-serif;padding-top:env(safe-area-inset-top,0px)}' +
  '#mtOv.on{display:flex}#mtOv *{box-sizing:border-box}#mtOv button{font:inherit;cursor:pointer}' +
  '.mt-bar{flex:none;display:flex;align-items:center;gap:8px;padding:10px 12px}.mt-bar h1{flex:1;font-size:18px;margin:0;line-height:1.25}' +
  '.mt-ib{flex:none;min-width:44px;height:44px;border:0;border-radius:12px;background:#fff;color:#3b2a14;font-size:18px;font-weight:700;box-shadow:0 2px 8px rgba(120,70,0,.12);padding:0 12px}' +
  '.mt-body{flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:4px 14px calc(18px + env(safe-area-inset-bottom,0px));max-width:640px;width:100%;margin:0 auto}' +
  '.mt-sub{font-size:14px;color:#7a5a2e;margin:0 0 12px;line-height:1.5}' +
  '.mt-grades{display:grid;grid-template-columns:1fr;gap:12px}' +
  '.mt-g{display:flex;align-items:center;gap:14px;border:0;border-radius:18px;padding:16px;color:#fff;text-align:left;box-shadow:0 8px 18px rgba(0,0,0,.15)}' +
  '.mt-g .ic{font-size:40px;line-height:1}.mt-g b{display:block;font-size:20px}.mt-g small{display:block;font-size:13px;opacity:.92}' +
  '.mt-sec{background:#fff;border-radius:16px;margin-bottom:10px;box-shadow:0 2px 8px rgba(120,70,0,.08);overflow:hidden}' +
  '.mt-sh{display:flex;align-items:center;gap:10px;width:100%;border:0;background:none;padding:14px;text-align:left;font-size:16px;font-weight:800;color:#3b2a14}' +
  '.mt-sh .ar{margin-left:auto;transition:transform .2s;color:#b07a2a}.mt-sec.open .mt-sh .ar{transform:rotate(90deg)}' +
  '.mt-sc{display:none;padding:0 14px 12px}.mt-sec.open .mt-sc{display:block}' +
  '.mt-it{padding:9px 0;border-top:1px dashed #f0d9b5}.mt-it b{display:block;color:#b45309;margin-bottom:3px;font-size:15px}.mt-it div{font-size:15px;line-height:1.6}' +
  '.mt-go{position:sticky;bottom:0;padding:12px 0 4px;background:linear-gradient(rgba(255,232,204,0),#ffe8cc 40%)}' +
  '.mt-btn{display:block;width:100%;border:0;border-radius:16px;padding:15px;font-size:17px;font-weight:800;color:#fff;background:linear-gradient(135deg,#f97316,#ea580c);box-shadow:0 6px 16px rgba(234,88,12,.35)}' +
  '.mt-btn.alt{background:#fff;color:#9a5a12;box-shadow:0 2px 8px rgba(120,70,0,.12)}' +
  '.mt-row{display:flex;gap:10px;margin-top:12px}.mt-row .mt-btn{flex:1}' +
  '.mt-hud{display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:15px;margin:2px 0 8px}' +
  '.mt-time{height:10px;border-radius:6px;background:#fde3c3;overflow:hidden;margin-bottom:14px}.mt-time i{display:block;height:100%;background:linear-gradient(90deg,#22c55e,#facc15,#ef4444);transform-origin:left;transition:transform .2s linear}' +
  '.mt-q{background:#fff;border-radius:18px;padding:20px 16px;font-size:clamp(18px,5vw,24px);font-weight:800;text-align:center;line-height:1.45;box-shadow:0 4px 12px rgba(120,70,0,.1);margin-bottom:14px}' +
  '.mt-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
  '.mt-o{border:0;border-radius:16px;padding:16px 10px;font-size:clamp(16px,4.6vw,20px);font-weight:800;background:#fff;color:#3b2a14;box-shadow:0 3px 10px rgba(120,70,0,.1);min-height:64px}' +
  '.mt-o.ok{background:#22c55e;color:#fff}.mt-o.bad{background:#ef4444;color:#fff}.mt-o:disabled{cursor:default}' +
  '.mt-ex{background:#fff3d6;border-radius:14px;padding:12px 14px;margin-top:12px;font-size:15px;line-height:1.55}' +
  '.mt-res{text-align:center}.mt-res .big{font-size:64px}.mt-res h2{margin:6px 0}.mt-stars{font-size:38px;color:#f59e0b;letter-spacing:6px}' +
  '.mt-tabs{display:flex;gap:8px;margin-bottom:12px}.mt-tab{flex:1;border:0;border-radius:12px;padding:10px;font-weight:800;background:#fff;color:#9a5a12}.mt-tab.on{background:#f97316;color:#fff}' +
  '@keyframes mtPop{0%{transform:scale(.9)}60%{transform:scale(1.05)}100%{transform:scale(1)}}.mt-pop{animation:mtPop .3s}';
  document.head.appendChild(st);

  var ov = document.createElement('div'); ov.id = 'mtOv';
  ov.innerHTML = '<div class="mt-bar"><button class="mt-ib" data-a="back" aria-label="Quay lại">←</button><h1 id="mtT">🧮 Toán học cấp 1</h1><button class="mt-ib" data-a="close">✕ Đóng</button></div><div class="mt-body" id="mtB"></div>';
  document.body.appendChild(ov);
  var B = document.getElementById('mtB'), T = document.getElementById('mtT');
  var cur = 'menu', grade = 1, Q = null, timer = 0;
  function stopT() { if (timer) { clearInterval(timer); timer = 0; } }
  function top() { B.scrollTop = 0; }

  function menu() {
    stopT(); cur = 'menu'; T.textContent = '🧮 Toán học cấp 1';
    var b = bests();
    B.innerHTML = '<p class="mt-sub">Chọn lớp học để xem tổng hợp kiến thức quan trọng theo chương trình Giáo dục phổ thông 2018 và làm thử thách trắc nghiệm có tính giờ.</p><div class="mt-grades">' +
      [1, 2, 3, 4, 5].map(function (g) { return '<button class="mt-g" data-a="grade" data-g="' + g + '" style="background:linear-gradient(135deg,' + COL[g] + ',' + COL[g] + 'cc)"><span class="ic">' + ICO[g] + '</span><span><b>' + (locked(g) ? '🔒 ' : '') + 'Toán học lớp ' + g + '</b><small>' + K[g].length + ' chủ đề kiến thức · ' + NQ + ' câu thử thách' + (b[g] ? ' · Kỷ lục: ' + b[g] + ' điểm' : '') + '</small></span></button>'; }).join('') + '</div>';
    top();
  }
  function locked(g) { return g > Math.ceil(5 / 3) && window.SixLock && !window.SixLock.isOpen(); }
  function gradeView(g) {
    if (locked(g)) { window.SixLock.ask(function () { gradeView(g); }); return; }
    stopT(); cur = 'grade'; grade = g; T.textContent = ICO[g] + ' Toán học lớp ' + g;
    B.innerHTML = '<p class="mt-sub">Chạm vào từng chủ đề để xem chi tiết. Ôn xong, bấm <b>Thử thách toán học</b> để kiểm tra (' + NQ + ' câu, mỗi câu ' + SEC[g] + ' giây).</p>' +
      K[g].map(function (s, i) { return '<div class="mt-sec' + (i === 0 ? ' open' : '') + '"><button class="mt-sh" data-a="tog"><span>' + s.ic + '</span><span>' + s.t + '</span><span class="ar">›</span></button><div class="mt-sc">' +
        s.it.map(function (x) { return '<div class="mt-it"><b>' + x[0] + '</b><div>' + x[1] + '</div></div>'; }).join('') + '</div></div>'; }).join('') +
      '<div class="mt-go"><button class="mt-btn" data-a="start">🎯 Thử thách toán học lớp ' + g + '</button></div>';
    top();
  }
  function start() {
    stopT(); cur = 'quiz'; Q = { qs: makeQuiz(grade), n: 0, ok: 0, score: 0, pick: -1, left: SEC[grade] };
    T.textContent = '🎯 Thử thách lớp ' + grade; draw(); tick();
  }
  function tick() {
    stopT(); Q.left = SEC[grade]; var t0 = Date.now();
    timer = setInterval(function () {
      Q.left = Math.max(0, SEC[grade] - (Date.now() - t0) / 1000);
      var bar = document.getElementById('mtBar'), tx = document.getElementById('mtLeft');
      if (bar) bar.style.transform = 'scaleX(' + (Q.left / SEC[grade]) + ')';
      if (tx) tx.textContent = '⏱ ' + Math.ceil(Q.left) + 's';
      if (Q.left <= 0) { stopT(); answer(-1); }
    }, 200);
  }
  function draw() {
    var q = Q.qs[Q.n], done = Q.pick !== -1;
    B.innerHTML = '<div class="mt-hud"><span>Câu ' + (Q.n + 1) + '/' + Q.qs.length + '</span><span id="mtLeft">⏱ ' + Math.ceil(Q.left) + 's</span><span>⭐ ' + Q.score + '</span></div>' +
      '<div class="mt-time"><i id="mtBar" style="transform:scaleX(' + (Q.left / SEC[grade]) + ')"></i></div>' +
      '<div class="mt-q">' + q.q + '</div><div class="mt-opts">' +
      q.o.map(function (o, i) { var c = ''; if (done) { if (o === q.a) c = ' ok'; else if (i === Q.pick) c = ' bad'; } return '<button class="mt-o' + c + '" data-a="ans" data-i="' + i + '"' + (done ? ' disabled' : '') + '>' + o + '</button>'; }).join('') + '</div>' +
      (done ? '<div class="mt-ex mt-pop">' + (Q.pick === -2 ? '⏰ Hết giờ! Đáp án đúng: <b>' + q.a + '</b>. ' : (q.o[Q.pick] === q.a ? '✅ Chính xác! ' : '❌ Chưa đúng. Đáp án: <b>' + q.a + '</b>. ')) + q.ex + '</div>' +
        '<div class="mt-row"><button class="mt-btn" data-a="next">' + (Q.n + 1 < Q.qs.length ? 'Câu tiếp theo ▶' : 'Xem kết quả ▶') + '</button></div>' : '');
  }
  function answer(i) {
    if (!Q || Q.pick !== -1) return;
    stopT();
    var q = Q.qs[Q.n];
    if (i === -1) { Q.pick = -2; sfx('bad'); }
    else { Q.pick = i; if (q.o[i] === q.a) { Q.ok++; Q.score += 10 + Math.ceil(Q.left / 2); sfx('ok'); } else sfx('bad'); }
    draw();
  }
  function next() {
    Q.n++; Q.pick = -1;
    if (Q.n >= Q.qs.length) return result();
    draw(); tick(); top();
  }
  function result() {
    stopT(); cur = 'result';
    var r = Q.ok / Q.qs.length, s = r >= 0.9 ? 3 : r >= 0.7 ? 2 : r >= 0.5 ? 1 : 0, nb = setBest(grade, Q.score);
    sfx(s >= 2 ? 'win' : (s ? 'ok' : 'bad'));
    if (s >= 2) { try { if (window.addStar) window.addStar(); } catch (e) {} }
    B.innerHTML = '<div class="mt-res"><div class="big">' + (s === 3 ? '🏆' : s ? '🎉' : '💪') + '</div><h2>Đúng ' + Q.ok + '/' + Q.qs.length + ' câu</h2>' +
      '<div class="mt-stars">' + '★'.repeat(s) + '☆'.repeat(3 - s) + '</div><p style="font-size:20px;font-weight:800">' + Q.score + ' điểm' + (nb ? ' · 🎉 Kỷ lục mới!' : '') + '</p>' +
      '<p class="mt-sub">' + (s === 3 ? 'Xuất sắc! Con đã nắm rất chắc kiến thức lớp ' + grade + '.' : s ? 'Giỏi lắm! Ôn lại phần kiến thức để đạt 3 sao nhé.' : 'Cố lên! Hãy đọc lại phần kiến thức rồi thử lại nhé.') + (s >= 2 ? ' Con được cộng 1 điểm ⭐ vào app.' : '') + '</p>' +
      '<div class="mt-row"><button class="mt-btn" data-a="start">↻ Làm lượt mới</button></div><div class="mt-row"><button class="mt-btn alt" data-a="grade" data-g="' + grade + '">📖 Xem lại kiến thức</button><button class="mt-btn alt" data-a="menu">Chọn lớp khác</button></div></div>';
    top();
  }

  ov.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-a]') : null; if (!el || el.disabled) return;
    var a = el.getAttribute('data-a');
    if (a === 'close') api.close();
    else if (a === 'back') { if (cur === 'menu') api.close(); else if (cur === 'grade') menu(); else gradeView(grade); }
    else if (a === 'menu') menu();
    else if (a === 'grade') gradeView(+el.getAttribute('data-g'));
    else if (a === 'tog') el.parentNode.classList.toggle('open');
    else if (a === 'start') start();
    else if (a === 'ans') answer(+el.getAttribute('data-i'));
    else if (a === 'next') next();
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden && cur === 'quiz' && Q && Q.pick === -1) { /* tạm dừng: tính lại giờ khi quay lại */ } });

  var api = {
    open: function () { menu(); ov.classList.add('on'); document.body.style.overflow = 'hidden'; },
    close: function () { stopT(); ov.classList.remove('on'); document.body.style.overflow = ''; },
    _gen: GEN, _make: makeQuiz
  };
  window.MathGame = api;
})();
