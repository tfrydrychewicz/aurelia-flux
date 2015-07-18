import {Metadata} from 'src/metadata';
import {Symbols} from 'src/symbols';

describe('Metadata', () => {
	describe('getOrCreateMetadata', () => {
		
		it('adds metadata', () => {
			
			let obj = {};
			
			expect(obj[Symbols.metadata]).toBeUndefined();			
			let metadata = Metadata.getOrCreateMetadata(obj);			
			expect(obj[Symbols.metadata]).toBeDefined();	
			expect(metadata instanceof Metadata).toBeTruthy();		
		});
		
		it('adds metadata only once', () => {
			let obj = {};
			
			let metadata1 = Metadata.getOrCreateMetadata(obj);
			let metadata2 = Metadata.getOrCreateMetadata(obj);
			
			expect(metadata1).toBe(metadata2);
		});
		
	});
	
	describe('exists', () => {
		it('return adequate value', () => {
			let obj = {};
			
			expect(Metadata.exists(obj)).toBeFalsy();			
			Metadata.getOrCreateMetadata(obj);
			expect(Metadata.exists(obj)).toBeTruthy();
		});
	});
});