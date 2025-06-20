const [exchangeRates, setExchangeRates] = useState([]);
const currenciesToShow = ["USD", "EUR", "MXN", "COP", "CRC", "HNL", "NIO"];

useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const res = await fetch("https://api.exchangerate.host/latest?base=GTQ");
        const data = await res.json();
        const rates = currenciesToShow.map((code) => ({
          code,
          rate: data.rates[code],
        }));
        setExchangeRates(rates);
      } catch (err) {
        console.error("Error al cargar tasas de cambio:", err);
      }
    };
  
    fetchExchangeRates();
  }, []);
  

