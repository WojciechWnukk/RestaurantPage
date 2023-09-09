import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import CheckRoles from '../CheckRoles';
import NavigationSelector from '../Scripts/NavigationSelector';
import ServerAvailability from '../Scripts/ServerAvailability';
import tempTables from '../Scripts/tempTables'; // Zaktualizowany sposób importu

const TableMap = ({ handleLogout }) => {
    // Stan przechowujący dane o stolikach
    const [tables, setTables] = useState([]);

    useEffect(() => {
        // Pobierz dane o stolikach z importowanego pliku
        setTables(tempTables);
    }, []);

    

    return (
        <div className={styles.tableMap_container}>
            <div>
                <ServerAvailability></ServerAvailability>
            </div>
            <div>
                <CheckRoles>
                    {(details) => (
                        <NavigationSelector
                            details={details}
                            cartItems={0}
                            handleLogout={handleLogout}
                            token={localStorage.getItem('token')}
                        />
                    )}
                </CheckRoles>
            </div>
            <div className={styles.tableMap}>
                <h2>Mapa Stolików</h2>
                <div className={styles.map}>
                    {tables.map((table) => (
                        <div
                            key={table.id}
                            className={styles.table}
                            style={{ left: table.x, top: table.y }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TableMap;
