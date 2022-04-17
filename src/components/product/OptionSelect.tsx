import { Flex, Select } from '@chakra-ui/react';
import { useState } from 'react';
import PopOver from './PopOver';

const OptionSelect = ({ color, size, stock, setCartCount, cartCount }) => {
  // const countArr = [1, 2, 3, 4, 5];
  // const colorArr = ['Red', 'Blue', 'Black', 'White', 'Yellow'];
  // const sizeArr = ['XS', 'S', 'M', 'L', 'XL'];
  const [stockValue, setStock] = useState(0);
  const [colorValue, setColor] = useState('');
  const [sizeValue, setSize] = useState('');

  function onCountChange(event) {
    console.log(event.target.value);
    setStock(event.target.value);
  }

  function onColorChange(event) {
    setColor(event.target.value);
  }
  function onSizeChange(event) {
    setSize(event.target.value);
  }

  return (
    <Flex w="100%" flexDirection={'column'}>
      <Flex w={'80%'} mt="5%" alignSelf="end" mb={'19%'}>
        <PopOver
          setCartCount={setCartCount}
          cartCount={cartCount}
          setStock={setStock}
          setSize={setSize}
          setColor={setColor}
          count={stockValue}
          size={sizeValue}
          color={colorValue}
        ></PopOver>
      </Flex>
      <Select mb={'4%'} placeholder="数量" value={stockValue} onChange={onCountChange}>
        {[...Array(stock)].map((count, key) => {
          return <option key={key}>{key + 1}</option>;
        })}
      </Select>
      {/* {count !== 0 ? null : <Text align={"right"} color={"red"}>数量を選択してください。</Text>} */}
      <Select mb={'4%'} placeholder="カラー" value={colorValue} onChange={onColorChange}>
        {JSON.parse(color).map((value, key) => {
          return <option key={key}>{value}</option>;
        })}
      </Select>
      {/* {color !== "" ? null : <Text align={"right"} color={"red"}>カラーを選択してください。</Text>} */}
      <Select mb={'4%'} placeholder="サイズ" value={sizeValue} onChange={onSizeChange}>
        {JSON.parse(size).map((value, key) => {
          return <option key={key}>{value}</option>;
        })}
      </Select>
      {/* {size !== "" ? null : <Text align={"right"} color={"red"}>サイズを選択してください。</Text>} */}
    </Flex>
  );
};
export default OptionSelect;
