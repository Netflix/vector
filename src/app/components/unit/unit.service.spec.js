'use strict';

describe('Service: Unit', function() {

    beforeEach(module('unit'));

    var UnitService;

    beforeEach(inject(function(_UnitService_){
        UnitService = _UnitService_;
    }));

    it('should convert us to ms', function() {
        expect(UnitService.convert(1001, 2002, 'us')).toEqual([1, 2, 'ms']);
    });

    it('should convert us to s', function() {
        expect(UnitService.convert(1000001, 2000002, 'us')).toEqual([1, 2, 's']);
    });

    it('should convert ms to minutes', function() {
        expect(UnitService.convert(1000*60*2, 1000*60*5, 'ms')).toEqual([2, 5, 'm']);
    });

    it('should only convert both values', function() {
        expect(UnitService.convert(1000*60*2, 2000, 'ms')).toEqual([120, 2, 's']);
    });

    it('should convert bytes', function() {
        expect(UnitService.convert(1024*1024*1024, 1024*1024*1024*3, 'B')).toEqual([1, 3, 'GB']);
    });

    it('should stop at PB', function() {
        expect(UnitService.convert(1024*1024*1024*2, 1024*1024*1024*3, 'GB')).toEqual([2048, 3072, 'PB']);
    });

    it('should convert other SI units', function() {
        expect(UnitService.convert(2002, 7004, 'kJ')).toEqual([2, 7, 'MJ']);
    });

    it('should convert other SI base units', function() {
        expect(UnitService.convert(2002, 7004, 'J')).toEqual([2, 7, 'kJ']);
    });

});