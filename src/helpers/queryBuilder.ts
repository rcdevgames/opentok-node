import { pool } from '../core/database';
import { converDatetoISO } from './common';

const convertFields = (fields: any = []) => {
    let callback = (fields.length > 0 ? '' : '');
    fields.forEach((v: String, i: Number) => {
        callback += v;
        callback += (i < (fields.length - 1) ? ',' : '');
    })
    return callback;
}
const convertConditions = (conditions: any = {}) => {
    let callback = (Object.keys(conditions).length > 0 ? ' WHERE ' : '');
    Object.keys(conditions).forEach((key, index) => {
        if (conditions[key] == null) {
          callback += key;
        }else {
          if (typeof conditions[key] === 'string') {
            conditions[key] = `'${conditions[key]}'`;
          }
          callback += `${key} = ${conditions[key]}`;
        }
        callback += (index < (Object.keys(conditions).length - 1) ? ' AND ' : '');
    })
    return callback;
}
const convertJoins = (joins: any = []) => {
    let callback = '';
    joins.forEach((v:any) => {
        let type = 'LEFT';
        if (v.type != undefined) {
        type = v.type.toUpperCase();
        }
        callback += ` ${type} JOIN ${v.target} ON ${v.condition}\n`;
    })
    return callback;
}
const convertOrders = (orders: any = []) => {
    let callback = (Object.keys(orders).length > 0 ? ' ORDER BY ' : '');
    Object.keys(orders).forEach((key, index) => {
        callback += `${key} ${orders[key].toUpperCase()}`;;
        callback += (index < (Object.keys(orders).length - 1) ? ',' : '');
    })
    return callback;
}
const converDateISO = (objectData: object = {}) => {
  if (Object.keys(objectData).length > 0) {
    let res = {};
    Object.keys(objectData).forEach((v) => {
      if (objectData[v] instanceof Date) {
        res[v] = converDatetoISO(objectData[v]);
      }else {
        res[v] = objectData[v];
      }
    });
    return res;
  }else {
    return objectData;
  }
}

const get = async (
    tableName: string, 
    fields: any, 
    conditions: any = {},
    orders: any = {},
    joins: Array<{type?: string, target: string, condition: string}> = [],
    limit: number = 0,
    offset: number = 0
) => {
    let query: string = '';
    try {
        const conn = await pool.connect();
        const fieldsConditions: string = convertFields(fields);
        const whereConditions: string = convertConditions(conditions);
        const joinConditions: string = convertJoins(joins);
        const orderConditions: string = convertOrders(orders);
        const limitCondition: string = (limit > 0 ? ` LIMIT ${limit} ` : '');
        const offsetCondition: string = (limit > 0 ? ` OFFSET ${offset} ` : '');
        query = `
          SELECT ${fieldsConditions} 
          FROM ${tableName} 
          ${joinConditions} 
          ${whereConditions}
          ${orderConditions}
          ${limitCondition} ${offsetCondition}
        `;
        // RETURNING
        const { rows } = await conn.query(query);
        conn.release();
        return rows.map((v) => converDateISO(v));
    } catch (err) {
        throw err.message +'\n sytanx: '+ query;
    }
}
const getOne = async (
    tableName: string,
    fields: string[],
    conditions: Object = {},
    joins: Array<{type?: string, target: string, condition: string}> = []
  ) => {
    try {
      const data = await get(tableName,fields,conditions,{},joins);
      if (data.length > 0) {
        return converDateISO(data[0]);
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
const getCount = async (tableName: string, conditions: any = {}, joins: Array<{type?: string, target: string, condition: string}> = []) => {
    try {
      const conn = await pool.connect();
      let whereConditions = convertConditions(conditions);
      let joinConditions: string = convertJoins(joins);
      const { rows } = await pool.query(`
        SELECT COUNT(*) AS count FROM ${tableName} 
        ${joinConditions}
        ${whereConditions}
      `);
      conn.release();
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
const insert = async (tableName: string, data: any = {}) => {
  let query:string = '';
  try {
    const conn = await pool.connect();
    let fields = '';
    let values = '';
    Object.keys(data).forEach((key: any, i: any) => {
      const comma = (i < (Object.keys(data).length - 1) ? ',' : '');
      fields += key;
      fields += comma;
      values += `'${data[key]}'`;
      values += comma;
    })
    query = `
      INSERT INTO ${tableName} 
      (${fields}) VALUES (${values})
    `;
    // RETURNING
    const { rows } = await conn.query(query);
    conn.release();
    return rows;
  } catch (err) {
    throw err.message + '\n sytanx: ' + query;
  }
}
const multiInsert = async (tableName: string, data: Array<{}>) => {
  let query:string = '';
  const conn = await pool.connect();
  try {
    data.forEach((val) => {
      let fields = '';
      let values = '';
      Object.keys(val).forEach((key: any, i: any) => {
        const comma = (i < (Object.keys(val).length - 1) ? ',' : '');
        fields += key;
        fields += comma;
        values += `'${val[key]}'`;
        values += comma;
      })
      query += `INSERT INTO ${tableName} (${fields}) VALUES (${values}); \n`;
    });
    
    await conn.query('BEGIN');
    await conn.query(query);
    await conn.query('COMMIT');
    // RETURNING
    conn.release();
    return true;
  } catch (err) {
    await conn.query('ROLLBACK');
    throw err.message + '\n sytanx: ' + query;
  }

}
const update = async (tableName: string, data: Object, conditions: {} = {}) => {
  let query: string = '';
  try {
    const conn = await pool.connect();
    let fields = '';
    let whereConditions = convertConditions(conditions);
    Object.keys(data).forEach((key: any, i: any) => {
      let value = data[key];
      if (typeof value === 'string') {
        value = `'${value}'`;
      }
      fields += ` ${key} = ${value} `;
      fields += (i < (Object.keys(data).length - 1) ? ',' : '');
    })
    query = `
      UPDATE ${tableName} SET ${fields} 
      ${whereConditions} 
    `;
    // RETURNING
    const { rows } = await conn.query(query);
    conn.release();
    return rows;
  } catch (err) {
    throw err.message + '\n sytanx: ' + query;
  }
}
const manual = async (query: string) => {
  try {
    const conn = await pool.connect();
    const { rows } = await conn.query(query);
    conn.release();
    return rows;
  } catch (err) {
    throw err.message + '\n sytanx: ' + query;
  }
}

export {
    get,
    getOne,
    getCount,
    insert,
    multiInsert,
    update,
    manual
}