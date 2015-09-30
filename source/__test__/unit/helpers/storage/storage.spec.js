describe('Helpers.LocalStorage', function () {
    it('should set and get value for key', function () {
        Helpers.LocalStorage.set('iwannacake', 'now');
        var result = Helpers.LocalStorage.get('iwannacake');
        expect(result).to.equal('now');
        Helpers.LocalStorage.remove('iwannacake');
    });

    it('should not get values after remove()', function(){
        Helpers.LocalStorage.set('iwannacoffee', 'now');
        Helpers.LocalStorage.remove('iwannacoffee');
        expect(Helpers.LocalStorage.get('iwannacoffee')).to.be.equal(undefined);
    });

    it('should not get values after clear()', function(){
        Helpers.LocalStorage.set('iwannacode', 'now');
        Helpers.LocalStorage.clear();
        expect(Helpers.LocalStorage.get('iwannacode')).to.be.equal(undefined);
    });
});
