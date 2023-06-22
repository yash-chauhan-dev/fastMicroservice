import { useEffect, useState } from "react"

export const Orders = () => {
    const [id, setId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [message, setMessage] = useState("Buy your favorite product")


    useEffect(() => {
        (async () => {
            try {
                if (id) {
                    const response = await fetch(`${process.env.REACT_APP_INVENTORY_SERVER_DOMAIN}/products/${id}`);
                    const content = await response.json();
                    const price = parseFloat(content.price) * 1.2;
                    setMessage(`Your product price is $${price}`);
                }
            } catch (e) {
                setMessage("Buy your favorite product")
            }
        })();
    }, [id]);

    const submit = async e => {
        e.preventDefault();

        await fetch(`${process.env.REACT_APP_PAYMENT_SERVER_DOMAIN}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id, quantity
            })
        });
        setMessage("Thank you for your order!");
    }

    return <div data-bs-theme="dark" style={{ backgroundColor: "rgba(255, 0, 0, 0.5)", overflow: 'hidden', height: '100vh' }}>
        <main class="px-md-1 text-bg-dark" style={{ height: '90vh' }}>
            <div class="container">
                <div className="py-5 text-center">
                    <h2>Checkout Form</h2>
                    <p className="lead">{message}</p>
                </div>
                <form onSubmit={submit}>
                    <div className="row g-3">
                        <div className="col-sm-6">
                            <label className="form-label">product</label>
                            <input className="form-control"
                                onChange={e => setId(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">Quantity</label>
                            <input type="number" className="form-control"
                                onChange={e => setQuantity(e.target.value)}
                            />
                        </div>
                    </div>
                    <hr className="my-4" />
                    <button className="w-100 btn btn-primary btn-lg" type="submit" >Buy</button>
                </form>
            </div>
        </main>
        <footer class="text-bg-dark my-1 py-4" style={{ height: '10vh' }}>
            <p class="text-center">&copy; 2023 MicroStore, Inc</p>
        </footer>
    </div>
}
