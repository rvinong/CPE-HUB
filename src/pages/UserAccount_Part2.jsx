const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_BASE_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setIsLogin(true);
        setLoginEmail("");
        setLoginPassword("");
      } else {
        const data = await response.json();
        // Handle login failure if needed
      }
    } catch (error) {
      // Handle login error if needed
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      // Handle password mismatch if needed
      return;
    }
    try {
      const response = await fetch(API_BASE_URL + "/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          mobile: signupMobile,
          birthday: signupBirthday,
          password: signupPassword,
        }),
      });
      if (response.ok) {
        setIsLogin(true);
        setSignupName("");
        setSignupEmail("");
        setSignupMobile("");
        setSignupBirthday("");
        setSignupPassword("");
        setSignupConfirmPassword("");
      } else {
        const data = await response.json();
        // Handle signup failure if needed
      }
    } catch (error) {
      // Handle signup error if needed
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {!token || !user ? (
        <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </h2>
          </div>
          {isLogin ? (
            <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
              <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary-dark">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Sign in
                </button>
              </div>

              <div className="text-sm text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Create account
                </button>
              </div>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSignupSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="signupName" className="block font-semibold mb-1">
                    Name
                  </label>
                  <input
                    id="signupName"
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signupEmail" className="block font-semibold mb-1">
                    Email
                  </label>
                  <input
                    id="signupEmail"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signupMobile" className="block font-semibold mb-1">
                    Mobile Number
                  </label>
                  <input
                    id="signupMobile"
                    type="tel"
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signupBirthday" className="block font-semibold mb-1">
                    Birthday
                  </label>
                  <input
                    id="signupBirthday"
                    type="date"
                    value={signupBirthday}
                    onChange={(e) => setSignupBirthday(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signupPassword" className="block font-semibold mb-1">
                    Password
                  </label>
                  <input
                    id="signupPassword"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signupConfirmPassword" className="block font-semibold mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="signupConfirmPassword"
                    type="password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                >
                  Sign Up
                </button>
              </div>
              <div className="text-sm text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Account</h2>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
          <div className="mb-4 border-b border-gray-300">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveSection("orders")}
                className={
                  activeSection === "orders"
                    ? "py-2 px-4 font-semibold border-b-2 border-primary text-primary"
                    : "py-2 px-4 font-semibold border-b-2 border-transparent text-gray-600 hover:text-primary"
                }
              >
                Orders
              </button>
              <button
                onClick={() => setActiveSection("address")}
                className={
                  activeSection === "address"
                    ? "py-2 px-4 font-semibold border-b-2 border-primary text-primary"
                    : "py-2 px-4 font-semibold border-b-2 border-transparent text-gray-600 hover:text-primary"
                }
              >
                Address
              </button>
            </nav>
          </div>
          {activeSection === "orders" && (
            <div>
              {orders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                <ul className="space-y-4">
                  {orders.map((order) => (
                    <li key={order._id} className="border p-4 rounded shadow">
                      <p>
                        <strong>Order ID:</strong> {order._id}
                      </p>
                      <p>
                        <strong>Status:</strong> {order.status}
                      </p>
                      <p>
                        <strong>Total:</strong> ₱ {order.total}
                      </p>
                      <p>
                        <strong>Items:</strong>
                      </p>
                      <ul className="list-disc list-inside">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.name} - Size: {item.size} - Qty: {item.qty} - ₱ {item.price}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {activeSection === "address" && (
            <div>
              {addresses.length === 0 ? (
                <p>No addresses found.</p>
              ) : (
                <ul className="space-y-4">
                  {addresses.map((address) => (
                    <li key={address._id || address.id} className="border p-4 rounded shadow">
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.state} {address.zip}
                      </p>
                      <p>{address.country}</p>
                      <p>Phone: {address.phone}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
</create_file>
