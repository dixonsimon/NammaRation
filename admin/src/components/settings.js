export default function Settings() {
    return (
        <div className="settings">
            <h2>Settings</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="site-name">Site Name</label>
                    <input type="text" id="site-name" name="site-name" />
                </div>
                <div className="form-group">
                    <label htmlFor="admin-email">Admin Email</label>
                    <input type="email" id="admin-email" name="admin-email" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" />
                </div>
                <button type="submit">Save Settings</button>
            </form>
        </div>
    );
}