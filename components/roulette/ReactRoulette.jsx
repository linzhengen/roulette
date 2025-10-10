import React, { useState, useEffect, useRef } from 'react';
import RouletteCore from './RouletteCore.js';

let optionIdCounter = 1;

function generateColor(id) {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[id % colors.length];
}

const ReactRoulette = () => {
  const canvasRef = useRef(null);
  const [newOptionName, setNewOptionName] = useState('');
  const [options, setOptions] = useState([]);
  const [gotOptions, setGotOptions] = useState([]);
  const [rouletteCore, setRouletteCore] = useState(null);
  const [optionColors, setOptionColors] = useState({});

  // Load from localStorage on component mount
  useEffect(() => {
    const savedOptions = localStorage.getItem('rouletteOptions');
    if (savedOptions) {
      const parsedOptions = JSON.parse(savedOptions);
      // Ensure all options have IDs
      const processedOptions = parsedOptions.map(option => ({
        ...option,
        id: option.id || optionIdCounter++,
        weight: option.weight || 1
      }));
      setOptions(processedOptions);
    }
  }, []);

  // Save to localStorage whenever options change
  useEffect(() => {
    localStorage.setItem('rouletteOptions', JSON.stringify(options));
  }, [options]);

  // Initialize roulette core when canvas is ready
  useEffect(() => {
    if (canvasRef.current) {
      const core = new RouletteCore(canvasRef.current);
      setRouletteCore(core);
    }
  }, []);

  // Update roulette when options change
  useEffect(() => {
    if (rouletteCore) {
      rouletteCore.setOptions(options);
    }
  }, [options, rouletteCore]);

  const getOptionColor = (id) => {
    if (!optionColors[id]) {
      const newColors = { ...optionColors, [id]: generateColor(id) };
      setOptionColors(newColors);
      return newColors[id];
    }
    return optionColors[id];
  };

  const addOption = () => {
    if (newOptionName.trim()) {
      const newOption = {
        id: optionIdCounter++,
        name: newOptionName.trim(),
        weight: 1
      };
      setOptions(prev => [...prev, newOption]);
      setNewOptionName('');
    }
  };

  const removeOption = (id) => {
    setOptions(prev => prev.filter(option => option.id !== id));
  };

  const removeGotOption = (id) => {
    setGotOptions(prev => prev.filter(option => option.id !== id));
  };

  const updateWeight = (id, newWeight) => {
    setOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, weight: newWeight } : option
      )
    );
  };

  const spin = () => {
    if (rouletteCore && options.length > 0) {
      rouletteCore.spin((result) => {
        setGotOptions(prev => [...prev, result]);
        setTimeout(() => {
          removeOption(result.id);
        }, 2000);
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addOption();
    }
  };

  return (
    <div className="roulette-container">
      <div className="columns">
        <div className="column">
          <div className="columns is-centered">
            <button
              className="button is-danger"
              onClick={spin}
              disabled={options.length === 0}
            >
              <span className="icon">
                <i className="fas fa-compass"></i>
              </span>
              <span>GO</span>
            </button>
          </div>
          <div className="columns is-centered">
            <canvas ref={canvasRef} width="500" height="500"></canvas>
          </div>
        </div>
        <div className="column">
          <div className="columns is-multiline">
            <div className="column">
              <div className="field is-grouped">
                <div className="control">
                  <input
                    value={newOptionName}
                    onChange={(e) => setNewOptionName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input"
                    type="text"
                    placeholder="Add new option"
                  />
                </div>
                <div className="control">
                  <button className="button is-primary" onClick={addOption}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          {options.length > 0 && (
            <div className="columns is-multiline">
              <div className="column">
                <h1 className="title is-4">候補</h1>
                <div className="tags">
                  {options.map((option) => (
                    <div
                      key={option.id}
                      className="tag is-medium"
                      style={{ backgroundColor: getOptionColor(option.id) }}
                    >
                      {option.name}
                      <div className="field has-addons has-addons-centered" style={{ marginLeft: '10px' }}>
                        <div className="control">
                          <input
                            value={option.weight}
                            onChange={(e) => updateWeight(option.id, parseInt(e.target.value) || 1)}
                            className="input is-small"
                            type="number"
                            min="1"
                            max="100"
                            style={{ width: '60px' }}
                          />
                        </div>
                      </div>
                      <button
                        className="delete is-small"
                        onClick={() => removeOption(option.id)}
                      ></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {gotOptions.length > 0 && (
            <div className="columns is-multiline">
              <div className="column">
                <h1 className="title is-4">当選</h1>
                <div className="tags">
                  {gotOptions.map((option) => (
                    <div
                      key={option.id}
                      className="tag is-danger is-medium"
                    >
                      {option.name}
                      <button
                        className="delete is-small"
                        onClick={() => removeGotOption(option.id)}
                      ></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactRoulette;