package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"

	jaccede "github.com/emembrives/jaccede/api"
)

type Empty struct{}

type PlaceInfo struct {
	Name       string
	Address    string
	Rating     float64
	Accessible bool
	JaccedeUid string
}

type jsonMap map[string]interface{}

var (
	indexTmpl = template.Must(template.ParseFiles("server/template/index.html"))
	infoTmpl  = template.Must(template.ParseFiles("server/template/infowindow.html"))

	diacriticsRemover = strings.NewReplacer("é", "e", "è", "e", "à", "a", "î", "i", "ô", "o", "ë", "e", "ï", "i", "ç", "c")
	accessibleIcon    = "/static/pictos_OVA.png"
	lastQuery         string
	lastResponse      *bytes.Buffer
)

func main() {
	http.HandleFunc("/search/", searchPlace)
	http.HandleFunc("/testrequest", makeJaccedeRequest)
	http.HandleFunc("/", indexHandler)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	indexTmpl.Execute(w, Empty{})
}

func searchPlace(w http.ResponseWriter, r *http.Request) {
	placeName := r.FormValue("placeName")
	placeAddress := r.FormValue("placeAddress")
	latitudeStr := r.FormValue("latitude")
	longitudeStr := r.FormValue("longitude")

	found, uid := runJaccedeQuery(placeName, placeAddress, latitudeStr, longitudeStr)

	info := PlaceInfo{Name: placeName, Address: placeAddress, Accessible: found, JaccedeUid: uid}

	if err := json.NewEncoder(w).Encode(&info); err != nil {
		panic(err)
	}
}

func runJaccedeQuery(name string, address string, latStr string, lngStr string) (bool, string) {
	client := jaccede.NewClient()
	request := jaccede.NewSearchRequest()
	request.SetSearchQuery(name, address, -1)
	if len(latStr) != 0 && len(lngStr) != 0 {
		lat, errLat := strconv.ParseFloat(latStr, 64)
		lng, errLng := strconv.ParseFloat(lngStr, 64)
		if errLat != nil || errLng != nil {
			log.Print(errLat)
			log.Print(errLng)
		} else {
			request.SetSearchLocation(lat, lng, 0.03)
		}
	}
	request.SetSearchParameters(0, 30)

	raw_response := client.SendRequest(request)
	var m map[string]interface{}
	json.NewDecoder(raw_response.Response.Body).Decode(&m)
	var places []interface{}
	switch m["results"].(type) {
	case map[string]interface{}:
		places = m["results"].(map[string]interface{})["items"].([]interface{})
	default:
		return false, ""
	}

	nameMap := getWordMap(name)

	for _, placeResult := range places {
		nameResultMap := getWordMap(placeResult.(map[string]interface{})["name"].(string))
		overlap, _ := wordMapOverlap(nameMap, nameResultMap)
		if overlap >= 1 {
			return true, placeResult.(map[string]interface{})["uid"].(string)
		}
	}

	return false, ""
}

func wordMapOverlap(m1, m2 map[string]bool) (overlap, max int) {
	overlap = 0
	for w, _ := range m1 {
		if m2[w] {
			overlap++
		}
	}
	max = len(m1) + len(m2) - overlap
	return
}

func getWordMap(s string) map[string]bool {
	var l []string = strings.Split(diacriticsRemover.Replace(s), " ")
	var m map[string]bool = make(map[string]bool)
	for _, word := range l {
		m[word] = true
	}
	return m
}

func makeJaccedeRequest(w http.ResponseWriter, r *http.Request) {
	client := jaccede.NewClient()
	request := jaccede.NewSearchRequest()
	request.SetSearchQuery("", "", -1)
	request.SetSearchLocation(48.893603, 2.248431, 0.1)
	request.SetSearchParameters(0, 30)

	response := client.SendRequest(request)
	body, err := ioutil.ReadAll(response.Response.Body)
	if err != nil {
		panic(err)
	}
	fmt.Fprintf(w, "%s", body)
}
