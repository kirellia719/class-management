import "./avatar-picker-style.scss";
import { Avatar, Button, Dialog, DialogActions } from "@mui/material";
import { useQuery } from "react-query";
import authAPI from "../../api/authAPI";
import { useState } from "react";
import useAuthStore from "../../store/authStore";
import env from "env";
import { toast } from "react-toastify";

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}
function stringAvatar(name) {
    const arrName = name.split(" ");
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${arrName[0][0]}${arrName[arrName.length - 1][0]}`,
    };
}

const AvatarPicker = ({ open, onClose }) => {
    const { user, setAvatar } = useAuthStore();
    const [avatar, setNewAvatar] = useState(user.avatar || "")
    const { data, isLoading } = useQuery(
        "avatars",
        async () => {
            const { data } = await authAPI.getAvatars();
            return data;
        },
    )

    const handleAvatarSelect = (avatar) => {
        // Call API to update avatar
        setNewAvatar(avatar);
    }

    const updateAvatar = async () => {
        try {
            const { data: response } = await authAPI.updateAvatar(avatar);
            if (response) {
                toast.success("Đã đổi avatar", {
                    autoClose: 1000,
                    position: 'top-center',
                });
                setAvatar(avatar);
                onClose();
            }
        } catch (error) {
            console.error("Lỗi cập nhật ảnh đại diện:", error);
        }
    }

    if (isLoading) return <div>Loading...</div>;
    return (
        <Dialog open={open} onClose={onClose}>
            <div className="avatar-picker">
                <div className="avatar-list">
                    <div className={`avatar ${!avatar ? "active" : ""}`} onClick={() => handleAvatarSelect("")}>
                        <Avatar variant="square" style={{ width: "100%", height: "100%", fontSize: "2rem" }} {...stringAvatar(user.fullname)} />
                    </div>
                    {data && data.map(a => (
                        <div key={a} className={`avatar ${a == avatar ? "active" : ""}`} onClick={() => handleAvatarSelect(a)}>
                            <img src={`${env.BE_URL}${a}`} alt={""} />
                        </div>
                    ))}
                </div>
            </div>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">Huỷ</Button>
                <Button onClick={updateAvatar} variant="contained" color="warning">Chọn</Button>
            </DialogActions>

        </Dialog>
    )
}

export default AvatarPicker;