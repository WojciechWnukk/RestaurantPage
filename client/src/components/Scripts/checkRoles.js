const [details, setDetails] = useState(null);


const handleGetUserDetails = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const config = {
          method: "get",
          url: "http://localhost:8080/api/users/user",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        };
        const { data: res } = await axios(config);
        setDetails(res.data);

      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    }
  };
  useEffect(() => {
    fetchOrders();
    handleGetUserDetails();
  }, [showAllOrders]);
  
  if (!details || details.roles !== "Admin") {
    return <p>Brak uprawnień</p>;
  }