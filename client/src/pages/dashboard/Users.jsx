import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaUserPlus, 
  FaUserEdit, 
  FaTrash, 
  FaEnvelope, 
  FaPhone, 
  FaUserShield,
  FaUserTie,
  FaUser,
  FaEllipsisV,
  FaEye,
  FaUserCheck,
  FaUserTimes,
  FaDownload
} from 'react-icons/fa';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    sortBy: 'newest'
  });

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockUsers = [
          {
            id: 'USR-1001',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 (555) 123-4567',
            role: 'admin',
            status: 'active',
            joinDate: '2023-01-15T10:30:00Z',
            lastLogin: '2023-07-28T14:45:00Z',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
          },
          {
            id: 'USR-1002',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1 (555) 987-6543',
            role: 'agent',
            status: 'active',
            joinDate: '2023-02-20T09:15:00Z',
            lastLogin: '2023-07-29T11:20:00Z',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
          },
          {
            id: 'USR-1003',
            name: 'Robert Johnson',
            email: 'robert@example.com',
            phone: '+1 (555) 456-7890',
            role: 'hotel_manager',
            status: 'inactive',
            joinDate: '2023-03-10T14:20:00Z',
            lastLogin: '2023-07-20T16:30:00Z',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
          },
          {
            id: 'USR-1004',
            name: 'Emily Davis',
            email: 'emily@example.com',
            phone: '+1 (555) 789-0123',
            role: 'agent',
            status: 'pending',
            joinDate: '2023-04-05T11:45:00Z',
            lastLogin: '2023-07-25T10:15:00Z',
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
          },
          {
            id: 'USR-1005',
            name: 'Michael Wilson',
            email: 'michael@example.com',
            phone: '+1 (555) 234-5678',
            role: 'hotel_manager',
            status: 'active',
            joinDate: '2023-05-12T13:20:00Z',
            lastLogin: '2023-07-30T09:45:00Z',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
          },
          {
            id: 'USR-1006',
            name: 'Sarah Brown',
            email: 'sarah@example.com',
            phone: '+1 (555) 876-5432',
            role: 'agent',
            status: 'suspended',
            joinDate: '2023-06-18T16:40:00Z',
            lastLogin: '2023-07-15T14:20:00Z',
            avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
          }
        ];

        setUsers(mockUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'newest') return new Date(b.joinDate) - new Date(a.joinDate);
      if (filters.sortBy === 'oldest') return new Date(a.joinDate) - new Date(b.joinDate);
      if (filters.sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (filters.sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaUserShield className="role-icon admin" />;
      case 'agent':
        return <FaUserTie className="role-icon agent" />;
      case 'hotel_manager':
        return <FaUserTie className="role-icon hotel-manager" />;
      default:
        return <FaUser className="role-icon user" />;
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'pending':
        return 'status-pending';
      case 'suspended':
        return 'status-suspended';
      default:
        return 'status-default';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get role text
  const getRoleText = (role) => {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format last seen
  const formatLastSeen = (dateString) => {
    const now = new Date();
    const lastSeen = new Date(dateString);
    const diffInDays = Math.floor((now - lastSeen) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(dateString);
  };

  // Get user stats
  const getUserStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const pendingUsers = users.filter(u => u.status === 'pending').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const agents = users.filter(u => u.role === 'agent').length;
    const hotelManagers = users.filter(u => u.role === 'hotel_manager').length;
    
    return { totalUsers, activeUsers, pendingUsers, admins, agents, hotelManagers };
  };

  const stats = getUserStats();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>Users</h1>
        <div className="header-actions">
          <button className="btn btn-export">
            <FaDownload className="icon" /> Export
          </button>
          <Link to="/dashboard/users/new" className="btn btn-primary">
            <FaUserPlus className="icon" /> Add User
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaUser />
          </div>
          <div className="stat-details">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon active">
            <FaUserCheck />
          </div>
          <div className="stat-details">
            <h3>{stats.activeUsers}</h3>
            <p>Active</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaUserTimes />
          </div>
          <div className="stat-details">
            <h3>{stats.pendingUsers}</h3>
            <p>Pending</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon roles">
            <FaUserShield />
          </div>
          <div className="stat-details">
            <h3>{stats.admins + stats.agents + stats.hotelManagers}</h3>
            <p>Staff Members</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="users-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="role-filter">Role:</label>
          <select
            id="role-filter"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="hotel_manager">Hotel Manager</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-by">Sort By:</label>
          <select
            id="sort-by"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        {filteredUsers.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="user-info">
                    <div className="user-avatar">
                      <img src={user.avatar} alt={user.name} />
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.name}</div>
                      <div className="user-id">{user.id}</div>
                    </div>
                  </td>
                  <td className="contact-info">
                    <div className="email">
                      <FaEnvelope className="icon" />
                      {user.email}
                    </div>
                    <div className="phone">
                      <FaPhone className="icon" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="role">
                    <span className={`role-badge role-${user.role}`}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                  </td>
                  <td className="date">
                    {formatDate(user.joinDate)}
                  </td>
                  <td className="last-login">
                    {formatLastSeen(user.lastLogin)}
                  </td>
                  <td className="actions">
                    <div className="dropdown">
                      <button className="dropdown-toggle">
                        <FaEllipsisV />
                      </button>
                      <div className="dropdown-menu">
                        <button className="dropdown-item">
                          <FaEye className="icon" /> View
                        </button>
                        <button className="dropdown-item">
                          <FaUserEdit className="icon" /> Edit
                        </button>
                        {user.status === 'active' ? (
                          <button className="dropdown-item text-warning">
                            <FaUserTimes className="icon" /> Deactivate
                          </button>
                        ) : (
                          <button className="dropdown-item text-success">
                            <FaUserCheck className="icon" /> Activate
                          </button>
                        )}
                        <button className="dropdown-item text-danger">
                          <FaTrash className="icon" /> Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <h3>No users found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="pagination">
          <button className="pagination-btn" disabled>Previous</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <span className="pagination-ellipsis">...</span>
          <button className="pagination-btn">10</button>
          <button className="pagination-btn">Next</button>
        </div>
      )}
    </div>
  );
};

export default Users;
