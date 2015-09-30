describe('Helpers.LocalStorage', function () {
    it('should set and get non-json value for key', function () {
        Helpers.LocalStorage.set('iwannacake', 'now');
        var result = Helpers.LocalStorage.get('iwannacake');
        expect(result).to.equal('now');
        Helpers.LocalStorage.remove('iwannacake');
    });

    it('should set and get json value for key', function(){
        var json = {
            name: "John",
            age: "35"
        };
        Helpers.LocalStorage.set("John", json);
        var rJson = Helpers.LocalStorage.get("John");
        expect(rJson.name).to.be.equal(json.name);
        expect(rJson.age).to.be.equal(json.age);
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

    it('should clear all values with given substring with cleanSubstringContains() method', function(){
        Helpers.LocalStorage.set('test', 'test');
        Helpers.LocalStorage.set('testing', 'testing');
        Helpers.LocalStorage.set('testify', 'testify');
        Helpers.LocalStorage.set('iwannathing', 'thing');
        Helpers.LocalStorage.cleanSubstringContains('test');
        expect(Helpers.LocalStorage.get('test')).to.be.equal(undefined);
        expect(Helpers.LocalStorage.get('testing')).to.be.equal(undefined);
        expect(Helpers.LocalStorage.get('testify')).to.be.equal(undefined);
        expect(Helpers.LocalStorage.get('iwannathing')).to.be.equal('thing');
    });
});
