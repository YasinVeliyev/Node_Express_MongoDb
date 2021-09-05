import { showAlert } from "./alerts";
const stripe = Stripe(
    "pk_test_51JVgkZCDvtHcKGZ70RgBYLIOvIfVrO9dz5FRr0N85eGgLXJ3csb38FldgIPlrtaLlsUpcZVHvzvwVYCboKKx4iic00mGAc1hua"
);

export const bookTour = async (tourId) => {
    try {
        const session = await fetch(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`, {});
        const data = await session.json();
        console.log(data);
        await stripe.redirectToCheckout({
            sessionId: data.data.session.id,
        });
    } catch (error) {
        console.log(error);
        showAlert("error", error);
    }
};
