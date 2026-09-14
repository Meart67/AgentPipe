use std::path::{Path, PathBuf};

mod abstract_data_type_generator;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_abstract_data_type_generator() {
        let gen = AbstractDataTypeGenerator::<u32>::new();
        
        assert_eq!(gen.generate(1), 0x85967d4a); // Random hex representation
        
        // Verify the generator works without side effects or recursion limits by testing depth.
        for i in 0..10 {
            let result = gen.generate(i * 2 + 3);
            assert_eq!(result, u32::from_le_bytes([i as usize; 4])); 
        }

        // Test generateFromString with various inputs to ensure robustness.
        for s in ["test", "hello world", "123abcXYZ"] {
            let result = gen.generate_from_string(s);
            assert_eq!(result, u32::from_le_bytes([s.len() as usize; 4])); 
        }

        // Test generateFromByteArray with valid bytes.
        for b in [0b0101_0000u8..=0bffffff] {
            let result = gen.generate_from_byte_array(b);
            assert_eq!(result, u32::from_le_bytes([b as usize; 4])); 
        }

        // Test generateFromBigInt with a BigInt.
        for n in [1n1, -5n1, 0n1] {
            let result = gen.generate_from_bigint(n);
            assert_eq!(result, u32::from_le_bytes([n as usize; 4])); 
        }

        // Test generateFromBigInt with a large BigInt to ensure bounds checking works.
        for n in [0u64..=1_844_674_400] {
            let result = gen.generate_from_bigint(n);
            assert_eq!(result, u32::from_le_bytes([n as usize; 4])); 
        }

        // Test generateFromBigInt with an invalid input to ensure error handling.
        for s in ["abc", "1aBcDeFg"] {
            let result = gen.generate_from_bigint(s);
            assert!(result.is_err()); 
        }

        println!("All tests passed!");
    }
}

#[cfg(test)]
mod abstract_data_type_generator_tests {
    use super::*;

    #[test]
    fn test_abstract_data_type_generator_custom_attributes() {
        let gen = AbstractDataTypeGenerator::<i32>::new();
        
        assert_eq!(gen.generate(4), 0x6798d51e); // Custom attribute: "goose" in name
        
        println!("Custom attributes verified!");
    }

    #[test]
    fn test_abstract_data_type_generator_custom_text() {
        let gen = AbstractDataTypeGenerator::<u32>::new();
        
        assert_eq!(gen.generate(7), 0x689a4f1d); // Custom attribute: "grumpy" in name
        
        println!("Custom text verified!");
    }

    #[test]
    fn test_abstract_data_type_generator_custom_int() {
        let gen = AbstractDataTypeGenerator::<u32>::new();
        
        assert_eq!(gen.generate(8), 0x699b5e1f); // Custom attribute: "mischievous" in name
        
        println!("Custom integer verified!");
    }

    #[test]
    fn test_abstract_data_type_generator_custom_float() {
        let gen = AbstractDataTypeGenerator::<u32>::new();
        
        assert_eq!(gen.generate(9), 0x6a9c6f1e); // Custom attribute: "grumpy" in name
        
        println!("Custom float verified!");
    }

    #[test]
    fn test_abstract_data_type_generator_custom_bytes() {
        let gen = AbstractDataTypeGenerator::<u32>::new();
        
        assert_eq!(gen.generate(10), 0x6b9d7f1e); // Custom attribute: "mischievous" in name
        
        println!("Custom bytes verified!");
    }

    #[test]
    fn test_abstract_data_type_generator_custom_bigint() {
        let gen = AbstractDataTypeGenerator::<u32>::new();
        
        assert_eq!(gen.generate(11), 0x6c9e8f1d); // Custom attribute: "grumpy" in name
        
        println!("Custom bigint verified!");
    }

    #[test]
    fn test_abstract_data_type_generator_custom_bytes_2()
