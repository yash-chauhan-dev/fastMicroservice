import logo from '../assets/microstore.png'
export const Wrapper = props => {
    return <div data-bs-theme="dark" style={{ backgroundColor: "rgba(255, 0, 0, 0.5)", overflow: 'hidden', height: '100vh' }}>
        <header class="text-bg-dark mb-1 border-bottom" style={{ height: '10vh' }}>
            <div class="container-fluid d-grid gap-3 gridTemp">
                <div>
                    <img src={logo} alt="logo" style={{ height: '10vh' }} />
                </div>

                <div class="d-flex align-items-center">
                    <form class="w-50 me-3" role="search">
                        <input type="search" class="form-control" placeholder="Search..." aria-label="Search" />
                    </form>
                </div>
            </div>
        </header >
        <main class="px-md-1 text-bg-dark" style={{ height: '80vh', overflowY: 'scroll' }}>
            {props.children}
        </main>

        <footer class="text-bg-dark my-1 py-4" style={{ height: '10vh' }}>
            <p class="text-center">&copy; 2023 MicroStore, Inc</p>
        </footer>
    </div >
}
