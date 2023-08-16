import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [mergedArrayMain, setMergedArrayMain] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getCoinData = async () => {
    setLoading(true);
    try {
      let res = await axios.get(
        "https://api.buyucoin.com/ticker/v1.0/liveData"
      );
      console.log("getCoinData", res);
      if (res.data.status === "success") {
        // setCoinData(res.data.data);
        getAllCurrencies(res?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
      setError(true);
    }
  };

  const getAllCurrencies = async (arr1) => {
    console.log("arr1", arr1);
    try {
      let res = await axios.get(
        "https://api.buyucoin.com/ticker/v1.0/allCurrencies"
      );
      console.log("getAllCurrencies", res);
      if (res.data.status === "success") {
        let arr2 = res.data.data;
        console.log("arr2", arr2);
        // setAllCurrencies(res.data.data);
        if (arr1.length > 0 && arr2.length > 0) {
          const uniqueData = arr1.map((v) => ({
            ...v,
            ...arr2.find((sp) => sp.currToName === v.name),
          }));
          if (uniqueData.length > 0) {
            setMergedArrayMain(uniqueData);
            console.log("mergedArrayMain", mergedArrayMain);
          }
          setLoading(false);
          console.log('loading', loading)
        }
      }
    } catch (error) {
      console.log("error", error);
      setError(true);
    }
  };

  useEffect(() => {
    getCoinData();
  }, []);

  return (
    <div className="App">
      <h1>buyUcoins</h1>
      <div
        className=""
        style={{
          padding: 20,
          display: "flex",
          gap: 20,
        }}
      >
        <div
          className=""
          style={{
            // width: "50%",
            margin: "0 auto",
          }}
        >
          <h4 style={{ textAlign: "left" }}>Cryptocurrency List</h4>

          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Coin</th>
                <th scope="col">Market Name</th>
                <th scope="col">Price</th>
                <th scope="col">Base Currency</th>
                <th scope="col">Quote Currency</th>
                <th scope="col">Code</th>
                <th scope="col">Max Deposit</th>
                <th scope="col">Max Withdraw</th>
                <th scope="col">With Fee</th>
              </tr>
            </thead>
            <tbody>
              {!loading
                ? mergedArrayMain.map((el) => {
                    return (
                      <tr key={el._id}>
                        <th scope="row">{el.currToName}</th>
                        <td>{el.marketName}</td>
                        <td>{el.LTRate}</td>
                        <td>{el.baseCurrency}</td>
                        <td>{el.quoteCurrency}</td>
                        {/* <th scope="row">{el.name}</th> */}
                        <td>{el.code}</td>
                        <td>{el.maxDeposit}</td>
                        <td>{el.maxWithdraw}</td>
                        <td>{el.withFee}</td>
                      </tr>
                    );
                  })
                : error
                ? "error loading data"
                : "loading"}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
