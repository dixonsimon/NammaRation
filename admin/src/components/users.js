export function Users() {
    const userList = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Alice Johnson', email: 'alice@example.com' },
    ];

    function renderUserList() {
        const userContainer = document.getElementById('user-list');
        userContainer.innerHTML = '';

        userList.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <p>ID: ${user.id}</p>
                <p>Name: ${user.name}</p>
                <p>Email: ${user.email}</p>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            `;
            userContainer.appendChild(userItem);
        });
    }

    function editUser(userId) {
        // Logic for editing a user
        console.log(`Editing user with ID: ${userId}`);
    }

    function deleteUser(userId) {
        // Logic for deleting a user
        console.log(`Deleting user with ID: ${userId}`);
    }

    return {
        renderUserList,
    };
}