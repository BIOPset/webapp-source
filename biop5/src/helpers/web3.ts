import { BO_CONTRACT, PRICE_PROVIDER_CONTRACT, BIOP_CONTRACT, RATECALC_CONTRACT } from '../constants'
import {bigNumberStringToInt} from "./bignumber";


const zeroAddress = "0x0000000000000000000000000000000000000000";

// general functions
export function blockTimestamp(blockNumber: string, web3: any) {
  return new Promise(async(resolve, reject) => {
    try {
      const block = await web3.eth.getBlock(blockNumber);
      
          // tslint:disable-next-line:no-console
          console.log(` raw block is ${block}`);
      resolve(block.timestamp*1000);
    } catch(e) {
      reject(e);
    }
  })
}

export function getPriceProviderContract(chainId: number, web3: any) {
  const pp = new web3.eth.Contract(
    PRICE_PROVIDER_CONTRACT[chainId].abi,
    PRICE_PROVIDER_CONTRACT[chainId].address
  )
  return pp;
}



export function getLatestPrice( chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const biop = getPriceProviderContract(chainId, web3)
    await biop.methods
      .latestRoundData()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }
          // tslint:disable-next-line:no-console
          console.log(data);
          // tslint:disable-next-line:no-console
          console.log("^ data is here");
          resolve(data.answer);
        }
      )
  })
}

// rate calc functions
export function getRateCalcContract(chainId: number, web3: any) {
  const rc = new web3.eth.Contract(
    RATECALC_CONTRACT[chainId].abi,
    RATECALC_CONTRACT[chainId].address
  )
  return rc;
}


export function getRate(amount: number, chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const rc = getRateCalcContract(chainId, web3)
    const max = await callPoolMaxAvailable(chainId, web3);
    await rc.methods
      .rate(amount, max)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data);
        }
      )
  })
}

// biop rewards functions
export function getBIOPContract(chainId: number, web3: any) {
  const bp = new web3.eth.Contract(
    BIOP_CONTRACT[chainId].abi,
    BIOP_CONTRACT[chainId].address
  )
  return bp;
}

export function callBIOPBalance(address: string, chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const bp = getBIOPContract(chainId, web3)
    await bp.methods
      .balanceOf(address)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
  })
}






export function getBOContract(chainId: number, web3: any) {
  const pool = new web3.eth.Contract(
    BO_CONTRACT[chainId].abi,
    BO_CONTRACT[chainId].address
  );
  return pool;
}




export function callSoldAmount(chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const biop = getBOContract(chainId, web3)
    await biop.methods
      .totalSupply()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          // tslint:disable-next-line:no-console
          console.log(`biop raw balance is ${data}`);
          resolve(data)
        }
      )
  })
}


 // POOL functions 
 export function callPoolTotalSupply(chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const pool = getBOContract(chainId, web3)
    await pool.methods
      .totalSupply()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
  })
}
export function callPoolMaxAvailable(chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const pool = getBOContract(chainId, web3)
    await pool.methods
      .getMaxAvailable()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
  })
}

export function callPoolNextWithdraw(address: string, chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const pool = getBOContract(chainId, web3)
    await pool.methods
      .nextWithdraw(address)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
  })
}

export function callPoolStakedBalance(address: string, chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const pool = getBOContract(chainId, web3)
    await pool.methods
      .balanceOf(address)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
  })
}

export function sendDeposit(address: string, amount: string, chainId: number, web3: any, onComplete: any) {
  return new Promise(async(resolve, reject) => {
    const pool = getBOContract(chainId, web3);
    // tslint:disable-next-line:no-console
    console.log(`depoyts`);
    // tslint:disable-next-line:no-console
    console.log(amount);
    // tslint:disable-next-line:no-console
    console.log(bigNumberStringToInt(amount));
    await pool.methods
      .stake()
      .send(
        { from: address, value: amount },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}

export function sendWithdraw(address: string, amount: string, chainId: number, web3: any, onComplete: any) {
  return new Promise(async(resolve, reject) => {
    const pool = getBOContract(chainId, web3);
    // tslint:disable-next-line:no-console
    console.log(`depoyts`);
    // tslint:disable-next-line:no-console
    console.log(amount);
    // tslint:disable-next-line:no-console
    console.log(bigNumberStringToInt(amount));
    await pool.methods
      .withdraw(amount)
      .send(
        { from: address },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}

export function getPoolLockedAmount( chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const bo = getBOContract(chainId, web3)
    await bo.methods
      .lockedAmount()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
  })
}


export function getDefaultPriceProvider( chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const bo = getBOContract(chainId, web3)
    await bo.methods
      .defaultPriceProvider()
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
  })
}




// binary options functions
export function makeBet(address: string, amount: string, callOption: boolean, time: number, chainId: number, web3: any, onComplete: any) {
  return new Promise(async(resolve, reject) => {
   
     // tslint:disable-next-line:no-console 
     console.log(`make bet 2  senbt vy ${address}`);
    const pool = getBOContract(chainId, web3);

    // TODO: replace thisx with dynamic input
    const pp = await getDefaultPriceProvider(chainId, web3);
    // tslint:disable-next-line:no-console 
   console.log(`got price provider ${pp}`);
    

    const type = callOption ? 1 : 0;
    const formattedAmount = bigNumberStringToInt(amount);
    // tslint:disable-next-line:no-console 
   console.log(`bet amuynt raw type ${typeof(amount)}`);
     // tslint:disable-next-line:no-console 
    console.log(`bet amuynt raw ${amount}`);
     // tslint:disable-next-line:no-console
    console.log(`bet amuynt raw ${formattedAmount}`);

    const poolLockedAmount = await getPoolLockedAmount(chainId, web3);
    // tslint:disable-next-line:no-console
    console.log(`pool locked amount${poolLockedAmount}`);
        // tslint:disable-next-line:no-console
        console.log(`formatted amount ${formattedAmount}`);
        // tslint:disable-next-line:no-console
     //   console.log(`possible payout ${possiblePaout}`);

        // tslint:disable-next-line:no-console
     console.log(`make bet 2  senbt vy ${address}`);
    await pool.methods
      .bet(type, pp, time)
      .send(
        { from: address, value: amount },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}

export function getPossiblePayout(amount: string, web3: any, chainId: number) {
  return new Promise(async(resolve, reject) => {
    const bin = getBOContract(chainId, web3);
    const formattedAmount = bigNumberStringToInt(amount);
        // tslint:disable-next-line:no-console
        console.log(`formatted amount ${formattedAmount}`);
    await bin.methods
      .calculatePossiblePayout(formattedAmount)
      .call(
        { from: zeroAddress },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
  })
}

export function sendExpire(address: string, optionId: any, chainId: number, web3: any, onComplete: any) {
  return new Promise(async(resolve, reject) => {
    const bin = getBOContract(chainId, web3);
    // tslint:disable-next-line:no-console
    console.log(`expiring option #${optionId}`);
    await bin.methods
      .expire(optionId)
      .send(
        { from: address },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}

export function sendExercise(address: string, optionId: any, chainId: number, web3: any, onComplete: any) {
  return new Promise(async(resolve, reject) => {
    const bin = getBOContract(chainId, web3);
    // tslint:disable-next-line:no-console
    console.log(`expiring option #${optionId}`);
    await bin.methods
      .exercise(optionId)
      .send(
        { from: address },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
      .on('confirmation', onComplete)
      .on('error', onComplete)
  })
}




export function getAllEvents(chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const bin = getBOContract(chainId, web3)
    await bin.getPastEvents('allEvents', {// 'create' evemt
    fromBlock: 'genesis', 
    toBlock: 'latest'}, (error: any, events: any) => {
      if (error) {
        reject(error);
      }
      resolve(events);
    })
})
}

export function getOptionCreation(chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const bin = getBOContract(chainId, web3)
    await bin.getPastEvents('Create', {// 'create' evemt
    fromBlock: 'genesis', 
    toBlock: 'latest'}, (error: any, events: any) => {
      if (error) {
        reject(error);
      }
     
      resolve(events);
    })
})
} 
  export function getOptionExpiration(chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
      const bin = getBOContract(chainId, web3)
      await bin.getPastEvents('Expire', {
        fromBlock: 'genesis', 
        toBlock: 'latest'}, (error: any, events: any) => {
        resolve(events);
        if (error) {
          reject(error);
        }
       
      resolve(events);
      })
  })
  }

  export function getOptionExercise(chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
      const bin = getBOContract(chainId, web3)
      await bin.getPastEvents('Exercise', {
        fromBlock: 'genesis', 
        toBlock: 'latest'}, (error: any, events: any) => {
        resolve(events);
        if (error) {
          reject(error);
        }
       
      resolve(events);
      })
  })
  }

  export function getOptionCloses(chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
      try {

        let options: any =  await getOptionExpiration(chainId, web3);
        options = options.concat( await getOptionExercise(chainId, web3));
        resolve(options);
      } catch(e) {
        reject(e);
      }
  })
  }
  
  export function getOptionsAndCloses(chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
      try {

        let options: any = await getOptionCreation(chainId, web3);
        options = options.concat( await getOptionExpiration(chainId, web3));
        options = options.concat( await getOptionExercise(chainId, web3));
        resolve(options);
      } catch(e) {
        reject(e);
      }
  })
  }