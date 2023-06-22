import { Link } from 'react-router-dom';
import { Wrapper } from './Wrapper';
import { useState, useEffect } from 'react';
export const Products = () => {

    const [products, setProducts] = useState([])

    useEffect(() => {
        (async () => {
            const response = await fetch(`${process.env.REACT_APP_INVENTORY_SERVER_DOMAIN}/products`);
            const content = await response.json();
            setProducts(content);
        })();
    }, []);

    const del = async id => {
        if (window.confirm('Are you sure to delete this record?')) {
            await fetch(`${process.env.REACT_APP_INVENTORY_SERVER_DOMAIN}/products/${id}`, {
                method: "DELETE"
            });
            setProducts(products.filter(p => p.id !== id));
        }
    }

    return <Wrapper>
        <div className="pt-3 pb-2 mb-3 border-bottom">
            <Link to={'/create'} className='btn btn-sm btn-outline-secondary'>Add</Link>
        </div>
        <table class="table" style={{ position: "sticky", top: "0" }}>
            <thead>
                <tr>
                    <th scope="col" style={{ position: "sticky", top: "0" }}>Id</th>
                    <th scope="col" style={{ position: "sticky", top: "0" }}>Name</th>
                    <th scope="col" style={{ position: "sticky", top: "0" }}>Price</th>
                    <th scope="col" style={{ position: "sticky", top: "0" }}>Quantity</th>
                    <th scope="col" style={{ position: "sticky", top: "0" }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => {
                    return <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.quantity}</td>
                        <td>
                            <a href="/" className='btn btn-sm btn-outline-secondary'
                                onClick={e => del(product.id)}
                            >
                                Delete
                            </a>
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
    </Wrapper>
}
