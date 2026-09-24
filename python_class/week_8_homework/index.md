---
title: "Box Pusher — Bài tập về nhà (Tuần 8)"
---

> - **File làm việc:** làm tiếp file `box_pusher.py` mà con đã làm trong tuần rồi.
> - **File cần tải về:** [week_8_homework_resources](./week_8_homework_resources.zip).
> 
> Giải nén các file ảnh và âm thanh này vào cùng thư mục với `box_pusher.py` để Pygame tìm thấy ảnh và âm thanh.
> Các file đã được chuẩn bị sẵn: ảnh thùng xanh `box_in.png` và hai âm thanh `move.wav`, `win.wav`.

---

## Nhiệm vụ 1: Thùng đổi màu khi nằm trên đích

### Yêu cầu

- Khi một thùng nằm trên vòng đích, thùng phải có **màu khác** để người chơi nhận ra ngay.
- Nếu thùng bị đẩy ra khỏi đích, nó phải trở lại màu bình thường.
- Không được làm mất hình dáng của thùng.

### Gợi ý

`Box` đã biết tự trả lời câu hỏi này:

```python
self.is_on_target(self.world.targets)
```

Trong `Box.__init__`, nạp sẵn cả hai ảnh **một lần**:

```python
self.img = pygame.image.load("box.png").convert_alpha()
self.img_in = pygame.image.load("box_in.png").convert_alpha()
```

Sau đó, trong `Box.draw()`, chọn ảnh cần vẽ:

- `True` → vẽ `self.img_in` (thùng xanh)
- `False` → vẽ `self.img` (thùng bình thường)

> **Câu hỏi suy nghĩ:** Tại sao phải kiểm tra trong `draw()` thay vì chỉ kiểm tra một lần trong `__init__`?

---

## Nhiệm vụ 2: Phát âm thanh khi người chơi di chuyển

### Yêu cầu

- Đi thành công một ô → phát `move.wav`.
- Đẩy thùng thành công → cũng phát `move.wav`.
- Đụng tường hoặc thùng bị chặn → **không phát âm thanh**.

### Gợi ý

Sau `pygame.init()`, nạp âm thanh **một lần**:

```python
move_sound = pygame.mixer.Sound("move.wav")
```

Phát âm thanh bằng:

```python
move_sound.play()
```

Trong `Player.move()`, hiện có hai nơi di chuyển thành công:

1. Người chơi bước vào ô trống.
2. Người chơi đẩy được một thùng rồi bước vào ô cũ của thùng.

Hãy đặt `move_sound.play()` trong cả hai nhánh thành công, sau khi vị trí đã thay đổi. Không đặt ở đầu method, vì khi đó đụng tường cũng sẽ phát tiếng.

---

## Nhiệm vụ 3: Phát âm thanh chiến thắng

### Yêu cầu

- Khi thùng cuối cùng vào đúng đích → phát `win.wav`.
- Mỗi màn chỉ phát tiếng thắng **một lần**.
- Phím `R` và `N` vẫn hoạt động bình thường.

### Gợi ý

Nạp âm thanh một lần, gần `move_sound`:

```python
win_sound = pygame.mixer.Sound("win.wav")
```

Trong phần `# --- UPDATE ---`, game đã có một khối chỉ chạy khi trạng thái đổi từ chưa thắng sang thắng:

```python
if not world.done and world.check_win():
    world.done = True
    # Phát âm thanh thắng ở đây
```

> **Không phát âm thanh trong `draw()`!** `draw()` chạy khoảng 60 lần mỗi giây, nên âm thanh sẽ bị phát lại liên tục.

---

## Bảng tự kiểm tra

- [ ] Thùng đổi màu ngay khi được đẩy lên đích.
- [ ] Thùng trở lại màu cũ nếu bị đẩy ra khỏi đích.
- [ ] Mỗi bước đi hợp lệ phát đúng một tiếng `move.wav`.
- [ ] Mỗi lần đẩy hợp lệ phát đúng một tiếng `move.wav`.
- [ ] Đụng tường hoặc đẩy một thùng đang bị chặn thì im lặng.
- [ ] Khi thắng, `win.wav` chỉ phát một lần.
- [ ] Bấm `R` để chơi lại và `N` để qua màn vẫn hoạt động.

---

## Gợi ý gỡ lỗi

| Vấn đề | Gợi ý kiểm tra |
|---|---|
| `FileNotFoundError: move.wav` | Chạy Python từ trong thư mục `week_8/`; kiểm tra hai file `.wav` nằm cạnh file `.py`. |
| Âm thanh bước chân phát khi đụng tường | `move_sound.play()` đang nằm quá sớm. Chuyển nó vào hai nhánh di chuyển thành công. |
| Âm thanh thắng phát liên tục | Không gọi `win_sound.play()` trong `draw()`. Đặt nó trong khối UPDATE có điều kiện `not world.done`. |
| Thùng không đổi sang màu xanh | Kiểm tra đã nạp đúng tên `box_in.png` và `draw()` có gọi `is_on_target(...)`. |
| Thùng đổi màu rồi không đổi lại | Kiểm tra `is_on_target(...)` mỗi lần `draw()` và chọn giữa `self.img_in` với `self.img`; không thay vĩnh viễn `self.img`. |
