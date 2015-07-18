import {Utils} from 'src/utils';

describe('Utils', () => {
   describe('patternsArrayToRegex', () => {
	   
	   it('handles *', () => {		   
		expect(Utils.patternsToRegex("*")).toEqual(/^.*$/);
		expect(Utils.patternsToRegex("foo*")).toEqual(/^foo.*$/);
		expect(Utils.patternsToRegex("foo*bar")).toEqual(/^foo.*bar$/);
	   });
	   
	   it('handles ?', () => {		   
		expect(Utils.patternsToRegex("?")).toEqual(/^.$/);
		expect(Utils.patternsToRegex("foo?")).toEqual(/^foo.$/);
		expect(Utils.patternsToRegex("foo?bar")).toEqual(/^foo.bar$/);
            expect(Utils.patternsToRegex("foo??bar")).toEqual(/^foo..bar$/);
	   });                  
	   
         it('escapes regex characters', () => {
            expect(Utils.patternsToRegex("foo()")).toEqual(/^foo\(\)$/);
            expect(Utils.patternsToRegex("foo[]")).toEqual(/^foo\[\]$/);
            expect(Utils.patternsToRegex("foo.")).toEqual(/^foo\.$/);
            expect(Utils.patternsToRegex("^(:foo)$")).toEqual(/^\^\(\:foo\)\$$/);
         });
         
         it('handles patterns array', () => {
            expect(Utils.patternsToRegex(["foo", "bar"])).toEqual(/^foo|bar$/);
            expect(Utils.patternsToRegex(["foo*", "bar?"])).toEqual(/^foo.*|bar.$/);
         });
   });
});