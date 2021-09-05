import { showAlert } from "./alerts";

export const login = async (email, password) => {
    console.log("sdas");
    try {
        const res = await fetch("http://localhost:3000/api/v1/users/login", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        let response = await res.json();
        if (res.status == 200) {
            window.setTimeout(() => {
                showAlert("success", "Loged in Successfully");
                location.assign("/");
            });
        } else {
            showAlert("error", response.message);
        }
    } catch (err) {
        console.log(err);
    }
};

export const logout = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/v1/users/logout", {
            method: "get",
        });
        if (res.status == 200) {
            location.assign("/login");
        } else {
            console.log(res);
        }
    } catch (err) {
        showAlert("error", "Error loging out.Try again");
    }
};
