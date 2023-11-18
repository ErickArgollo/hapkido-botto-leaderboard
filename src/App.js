import React from 'react';
import './App.css';

import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Flipper, Flipped } from 'react-flip-toolkit';

function App() {
  const [data, setData] = useState([]);
  const [podiumData, setPodiumData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  function score(team) {
    return (
      parseInt(team.Ouro) * 3 +
      parseInt(team.Prata) * 2 +
      parseInt(team.Bronze)
    );
  }

  const fetchPodium = async () => {
    const url = `https://sheetdb.io/api/v1/mpd1mwq0f1mha`;
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      const lastSix = response.data.slice(-6).reverse();
      setPodiumData(lastSix);
    } catch (error) {
      console.error('Error ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    const url = `https://sheetdb.io/api/v1/9dyhntggmeub8`;

    try {
      const response = await axios.get(url);
      const orderedData = response.data.sort(
        (a, b) => score(b) - score(a)
      );
      setData(orderedData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPodium();
    fetchData();
  }, []);

  return (
    <div className='container'>
      <div className='content'>
        <h1 className="text-center my-4">Torneio Interno 2023</h1>
        <Flipper flipKey={data.map((item) => item.Equipe).join()}>
          <table className="table1 table-hover">
            <thead>
              <tr>
                <th>Equipe</th>
                <th>Ouro</th>
                <th>Prata</th>
                <th>Bronze</th>
                <th>Pontuação Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <Flipped key={item.Equipe} flipId={item.Equipe}>
                  <tr>
                    <td>{`${index + 1}º ${item.Equipe}`}</td>
                    <td>
                      <FontAwesomeIcon icon={faMedal} className="text-warning" />{' '}
                      {item.Ouro}
                    </td>
                    <td>
                      <FontAwesomeIcon
                        icon={faMedal}
                        className="text-secondary"
                      />{' '}
                      {item.Prata}
                    </td>
                    <td>
                      <FontAwesomeIcon icon={faMedal} className="bronze" />{' '}
                      {item.Bronze}
                    </td>
                    <td>{score(item)}</td>
                  </tr>
                </Flipped>
              ))}
            </tbody>
          </table>
        </Flipper>

        <h3 className="text-center my-4">Últimas premiações</h3>

        <Flipper flipKey={podiumData.join('')}>
        <table className="table1 table-hover">
          <thead>
            <tr>
              <th>Equipe</th>
              <th>Atleta</th>
              <th>Modalidade</th>
              <th>Faixa</th>
              <th>Medalha</th>
              <th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            {podiumData.map((competidor, index) => (
              <Flipped key={index} flipId={competidor.Nome}>
                <tr>
                  <td>{competidor.Equipe}</td>
                  <td>{competidor.Atleta}</td>
                  <td>{competidor.Modalidade}</td>
                  <td>{competidor.Faixa}</td>
                  <td>{competidor.Medalha}</td>
                  <td>{competidor.Categoria}</td>
                </tr>
              </Flipped>
            ))}
          </tbody>
        </table>
      </Flipper>

      <div className="d-flex justify-content-center align-items-center mb-3">
          {isLoading ? (
            <div className="text-center mt-3">
              <FontAwesomeIcon icon={faSpinner} spin size="4x" style={{ color: 'white' }} />
            </div>
          ) : (
            <button onClick={() => { fetchData(); fetchPodium(); }}  class="btn btn-warning mt-3 fs-4">
              Atualizar
            </button>
          )}
      </div>
      </div>
    </div>
  );
}

export default App;
