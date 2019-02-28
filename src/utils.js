export const processResponse = (res, setCount, setVocab) => {
    for (let item of res) {
        if (item.count) {
          setCount(item.count);
          break;
        }
        console.log('item', item);
      }
      setVocab(res);
};