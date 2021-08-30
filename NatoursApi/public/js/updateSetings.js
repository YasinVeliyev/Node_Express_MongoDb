import { showAlert } from "./alerts";

export const updateData = async (data, type) => {
    let url =
        type === "password"
            ? "http://localhost:3000/api/v1/users/updatepassword"
            : "http://localhost:3000/api/v1/users/updateme";

    const response = await fetch(url, {
        method: "PATCH",
        body: data,
    });
    console.log(data.get("name"));
    let res = await response.json();
    console.log(res);
    if (response.status == 201) {
        window.setTimeout(() => {
            showAlert("success", `${type} updated successfully`);
            type === "password" ? location.assign("/login") : location.assign("/me");
        });
    }
    showAlert("error", response.message);
};
